import hashlib, hmac, json, uuid
from decimal import Decimal
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
from .models import Category, Product, ProductVariant, Review, Address, WishlistItem, Coupon, Order, OrderItem, CustomerProfile
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer, AddressSerializer, OrderSerializer, UserSerializer

User=get_user_model()

def product_qs():
    return Product.objects.filter(active=True).select_related("category").prefetch_related("images","variants","reviews")

@api_view(["GET"])
@permission_classes([AllowAny])
def products(request):
    qs=product_qs()
    category=request.GET.get("category")
    if category and category not in ("all","new-arrivals","best-sellers"):
        qs=qs.filter(category__slug=category)
    if category=="new-arrivals": qs=qs.filter(is_new=True)
    if category=="best-sellers": qs=qs.filter(is_best_seller=True)
    q=request.GET.get("q")
    if q: qs=qs.filter(name__icontains=q)
    return Response(ProductSerializer(qs,many=True,context={"request":request}).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def product_detail(request, slug):
    p=product_qs().filter(slug=slug).first()
    if not p: return Response({"detail":"Product not found"},status=404)
    return Response(ProductSerializer(p,context={"request":request}).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def categories(request):
    return Response(CategorySerializer(Category.objects.filter(active=True),many=True).data)

@api_view(["POST"])
def register(request):
    email=request.data.get("email","").strip().lower()
    name=request.data.get("name","").strip()
    phone=request.data.get("phone","").strip()
    password=request.data.get("password","")
    if not email or not password or not name: return Response({"detail":"Name, email and password are required."},400)
    if User.objects.filter(username=email).exists(): return Response({"detail":"An account with this email already exists."},400)
    user=User.objects.create_user(username=email,email=email,password=password,first_name=name, last_name="")
    CustomerProfile.objects.create(user=user, phone=phone)
    refresh=RefreshToken.for_user(user)
    return Response({"access":str(refresh.access_token),"refresh":str(refresh),"user":UserSerializer(user).data},201)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class=AddressSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self): return Address.objects.filter(user=self.request.user)
    def perform_create(self,serializer): serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class=None
    permission_classes=[IsAuthenticated]
    def list(self,request):
        return Response(list(WishlistItem.objects.filter(user=request.user).values_list("product__slug",flat=True)))
    def create(self,request):
        product=Product.objects.filter(slug=request.data.get("product_id"),active=True).first()
        if not product: return Response({"detail":"Product not found"},404)
        item,_=WishlistItem.objects.get_or_create(user=request.user,product=product)
        return Response({"product_id":item.product_id},201)
    def destroy(self,request,pk=None):
        WishlistItem.objects.filter(user=request.user,product__slug=pk).delete()
        return Response(status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def validate_coupon(request):
    code=request.data.get("code","").strip().upper()
    subtotal=Decimal(str(request.data.get("subtotal",0)))
    c=Coupon.objects.filter(code=code,active=True).first()
    if not c: return Response({"valid":False,"message":"Invalid promo code."})
    discount=c.calculate(subtotal)
    if subtotal<c.minimum_spend: return Response({"valid":False,"message":f"Minimum cart value is ₹{c.minimum_spend}."})
    return Response({"valid":True,"code":c.code,"discount":discount,"message":"Promo code applied."})

def _make_order_number(): return f"NRV-{uuid.uuid4().hex[:10].upper()}"


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    items = data.get("items", [])

    if not items:
        return Response({"detail": "Cart is empty."}, status=400)

    # Reject COD and every other unsupported payment method.
    payment_method = data.get("paymentMethod", "razorpay")
    if payment_method != "razorpay":
        return Response(
            {"detail": "Only online payment through Razorpay is available."},
            status=400,
        )

    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return Response(
            {"detail": "Razorpay is not configured. Please try again later."},
            status=503,
        )

    shipping = data.get("shippingAddress") or {}
    required = [
        "fullName", "email", "phone", "addressLine1",
        "city", "state", "pincode",
    ]

    if any(not str(shipping.get(key, "")).strip() for key in required):
        return Response(
            {"detail": "Complete shipping details are required."},
            status=400,
        )

    shipping_method = data.get("shippingMethod", "standard")
    if shipping_method not in ("standard", "priority"):
        return Response({"detail": "Invalid shipping method."}, status=400)

    coupon_code = (data.get("couponCode") or "").strip().upper()

    with transaction.atomic():
        subtotal = Decimal("0")
        order_lines = []
        c = None

        for item in items:
            p = (
                Product.objects.filter(
                    slug=item.get("productId"),
                    active=True,
                )
                .prefetch_related("variants")
                .first()
            )

            if not p:
                return Response(
                    {"detail": "A product in your cart is unavailable."},
                    status=409,
                )

            size = str(item.get("size", ""))
            color = str(item.get("colorName", ""))

            variant = ProductVariant.objects.select_for_update().filter(
                product=p,
                size=size,
                color_name=color,
            ).first()

            try:
                qty = int(item.get("quantity", 0))
            except (TypeError, ValueError):
                qty = 0

            if not variant or qty < 1 or variant.stock < qty:
                return Response(
                    {"detail": f"Insufficient stock for {p.name} ({size}/{color})."},
                    status=409,
                )

            subtotal += p.price * qty
            order_lines.append((p, variant, qty))

        discount = Decimal("0")

        if coupon_code:
            c = Coupon.objects.select_for_update().filter(
                code=coupon_code,
                active=True,
            ).first()

            if c:
                if subtotal < c.minimum_spend:
                    return Response(
                        {"detail": f"Minimum cart value is ₹{c.minimum_spend}."},
                        status=400,
                    )
                discount = Decimal(str(c.calculate(subtotal)))

        shipping_fee = (
            Decimal("0")
            if subtotal >= Decimal("2000")
            else Decimal("99")
        )

        

        total = max(Decimal("0"), subtotal - discount + shipping_fee)

        order = Order.objects.create(
            user=request.user,
            order_number=_make_order_number(),
            subtotal=subtotal,
            discount=discount,
            shipping_fee=shipping_fee,
            total=total,
            payment_method="razorpay",
            payment_status="created",
            order_status="pending",
            coupon_code=coupon_code,
            shipping_name=shipping["fullName"],
            shipping_email=shipping["email"],
            shipping_phone=shipping["phone"],
            address_line1=shipping["addressLine1"],
            address_line2=shipping.get("addressLine2", ""),
            city=shipping["city"],
            state=shipping["state"],
            pincode=shipping["pincode"],
        )

        for p, v, qty in order_lines:
            OrderItem.objects.create(
                order=order,
                product=p,
                product_name=p.name,
                unit_price=p.price,
                size=v.size,
                color_name=v.color_name,
                color_hex=v.color_hex,
                quantity=qty,
            )

        if coupon_code and c:
            c.used_count += 1
            c.save(update_fields=["used_count"])

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET,
            )
        )

        try:
            rp = client.order.create({
                "amount": int(total * 100),
                "currency": "INR",
                "receipt": order.order_number,
                "notes": {"order_number": order.order_number},
            })
        except Exception:
            # Roll back the order and related items if Razorpay creation fails.
            raise

        order.razorpay_order_id = rp["id"]
        order.save(update_fields=["razorpay_order_id"])

    return Response(
        {
            "orderId": order.id,
            "orderNumber": order.order_number,
            "amount": str(order.total),
            "currency": "INR",
            "razorpayOrderId": order.razorpay_order_id,
            "razorpayKeyId": settings.RAZORPAY_KEY_ID,
            "paymentMethod": "razorpay",
        },
        status=201,
    )




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    order = Order.objects.filter(
        id=request.data.get("orderId"),
        user=request.user,
    ).first()

    if not order:
        return Response({"detail": "Order not found."}, status=404)

    if order.payment_method != "razorpay":
        return Response({"detail": "Not a Razorpay order."}, status=400)

    payload = {
        key: request.data.get(key, "")
        for key in (
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
        )
    }

    if payload["razorpay_order_id"] != order.razorpay_order_id:
        return Response({"detail": "Order mismatch."}, status=400)

    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        (
            f'{payload["razorpay_order_id"]}|'
            f'{payload["razorpay_payment_id"]}'
        ).encode(),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, payload["razorpay_signature"]):
        return Response(
            {"detail": "Payment signature verification failed."},
            status=400,
        )

    with transaction.atomic():
        locked = Order.objects.select_for_update().get(pk=order.pk)

        # Never automatically confirm a cancelled order.
        if locked.order_status == "cancelled":
            return Response(
                {
                    "detail": (
                        "This order was cancelled. If your payment was captured, "
                        "please contact support to arrange a refund."
                    )
                },
                status=409,
            )

        if locked.payment_status == "paid":
            return Response({
                "success": True,
                "orderNumber": locked.order_number,
            })

        items = list(
            OrderItem.objects.filter(order=locked).select_related("product")
        )
        variants = []

        for item in items:
            variant = ProductVariant.objects.select_for_update().filter(
                product=item.product,
                size=item.size,
                color_name=item.color_name,
            ).first()

            if not variant or variant.stock < item.quantity:
                return Response(
                    {
                        "detail": (
                            f"Stock changed for {item.product_name}. "
                            "Please contact support."
                        )
                    },
                    status=409,
                )

            variants.append((variant, item.quantity))

        for variant, quantity in variants:
            variant.stock -= quantity
            variant.save(update_fields=["stock"])

        locked.payment_status = "paid"
        locked.order_status = "confirmed"
        locked.razorpay_payment_id = payload["razorpay_payment_id"]
        locked.save(
            update_fields=[
                "payment_status",
                "order_status",
                "razorpay_payment_id",
                "updated_at",
            ]
        )

    return Response({
        "success": True,
        "orderNumber": order.order_number,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    qs=Order.objects.filter(user=request.user).prefetch_related("items__product__images")
    return Response(OrderSerializer(qs,many=True,context={"request":request}).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_number):
    with transaction.atomic():
        order = (
            Order.objects.select_for_update()
            .filter(order_number=order_number, user=request.user)
            .first()
        )

        if not order:
            return Response({"detail": "Order not found."}, status=404)

        if order.order_status == "cancelled":
            return Response({"detail": "This order is already cancelled."}, status=400)

        if order.order_status in ("shipped", "delivered"):
            return Response(
                {"detail": "This order can no longer be cancelled online."},
                status=409,
            )

        # Paid Razorpay orders require a real refund workflow.
        if order.payment_method == "razorpay" and order.payment_status == "paid":
            return Response(
                {
                    "detail": (
                        "This order has already been paid. Please contact support "
                        "to request cancellation and a refund."
                    )
                },
                status=409,
            )

        if order.payment_method == "razorpay" and order.payment_status not in (
            "created",
            "failed",
        ):
            return Response(
                {"detail": "This payment needs to be checked before cancellation."},
                status=409,
            )

        # COD stock was reserved during checkout, so restore it once.
        if order.payment_method == "cod":
            items = list(order.items.select_related("product").all())
            variants = []

            for item in items:
                variant = ProductVariant.objects.select_for_update().filter(
                    product=item.product,
                    size=item.size,
                    color_name=item.color_name,
                ).first()

                if not variant:
                    return Response(
                        {
                            "detail": (
                                f"Could not find the stock variant for "
                                f"{item.product_name}. Please contact support."
                            )
                        },
                        status=409,
                    )

                variants.append((variant, item.quantity))

            for variant, quantity in variants:
                variant.stock += quantity
                variant.save(update_fields=["stock"])

        order.order_status = "cancelled"

        # A cancelled unpaid Razorpay order has not been paid.
        if order.payment_method == "razorpay":
            order.payment_status = "failed"

        order.save(update_fields=["order_status", "payment_status", "updated_at"])

    return Response({
        "success": True,
        "orderNumber": order.order_number,
        "orderStatus": order.order_status,
        "paymentStatus": order.payment_status,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request,slug):
    p=Product.objects.filter(slug=slug,active=True).first()
    if not p: return Response({"detail":"Product not found"},404)
    r=Review.objects.create(product=p,user=request.user,rating=int(request.data.get("rating",5)),title=request.data.get("title",""),comment=request.data.get("comment",""),verified=OrderItem.objects.filter(order__user=request.user,product=p,order__payment_status="paid").exists())
    return Response(ReviewSerializer(r).data,201)

@csrf_exempt
def razorpay_webhook(request):
    if request.method != "POST":
        return HttpResponse(status=405)

    if not settings.RAZORPAY_WEBHOOK_SECRET:
        return HttpResponse(status=503)

    signature = request.headers.get("X-Razorpay-Signature", "")
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        request.body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        return HttpResponse(status=400)

    try:
        payload = json.loads(request.body)
    except (ValueError, TypeError):
        return HttpResponse(status=400)

    if payload.get("event") != "payment.captured":
        return HttpResponse(status=200)

    payment = (
        payload.get("payload", {})
        .get("payment", {})
        .get("entity", {})
    )
    razorpay_order_id = payment.get("order_id")
    payment_id = payment.get("id")

    if not razorpay_order_id or not payment_id:
        return HttpResponse(status=400)

    with transaction.atomic():
        order = (
            Order.objects.select_for_update()
            .filter(razorpay_order_id=razorpay_order_id)
            .first()
        )

        if not order:
            return HttpResponse(status=200)

        # Idempotency: don't deduct stock twice for a payment already recorded.
        if order.payment_status == "paid":
            return HttpResponse(status=200)

        # A captured payment for a cancelled order needs manual refund handling.
        if order.order_status == "cancelled":
            order.payment_status = "paid"
            order.razorpay_payment_id = payment_id
            order.save(
                update_fields=[
                    "payment_status",
                    "razorpay_payment_id",
                    "updated_at",
                ]
            )
            return HttpResponse(status=200)

        items = list(
            OrderItem.objects.filter(order=order).select_related("product")
        )
        variants = []

        for item in items:
            variant = ProductVariant.objects.select_for_update().filter(
                product=item.product,
                size=item.size,
                color_name=item.color_name,
            ).first()

            if not variant or variant.stock < item.quantity:
                # Payment was captured, but stock needs manual resolution.
                order.payment_status = "paid"
                order.razorpay_payment_id = payment_id
                order.save(
                    update_fields=[
                        "payment_status",
                        "razorpay_payment_id",
                        "updated_at",
                    ]
                )
                return HttpResponse(status=200)

            variants.append((variant, item.quantity))

        for variant, quantity in variants:
            variant.stock -= quantity
            variant.save(update_fields=["stock"])

        order.payment_status = "paid"
        order.order_status = "confirmed"
        order.razorpay_payment_id = payment_id
        order.save(
            update_fields=[
                "payment_status",
                "order_status",
                "razorpay_payment_id",
                "updated_at",
            ]
        )

    return HttpResponse(status=200)