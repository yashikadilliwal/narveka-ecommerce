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
    data=request.data
    items=data.get("items",[])
    if not items: return Response({"detail":"Cart is empty."},400)
    shipping=data.get("shippingAddress") or {}
    required=["fullName","email","phone","addressLine1","city","state","pincode"]
    if any(not str(shipping.get(k,"")).strip() for k in required):
        return Response({"detail":"Complete shipping details are required."},400)
    payment_method=data.get("paymentMethod","razorpay")
    shipping_method=data.get("shippingMethod","standard")
    if payment_method not in ("razorpay","cod"): return Response({"detail":"Unsupported payment method."},400)
    coupon_code=(data.get("couponCode") or "").strip().upper()
    with transaction.atomic():
        subtotal=Decimal("0")
        order_lines=[]
        for item in items:
            p=Product.objects.filter(slug=item.get("productId"),active=True).prefetch_related("variants").first()
            if not p: return Response({"detail":"A product in your cart is unavailable."},409)
            size=str(item.get("size","")); color=str(item.get("colorName",""))
            variant=ProductVariant.objects.select_for_update().filter(product=p,size=size,color_name=color).first()
            qty=int(item.get("quantity",0))
            if not variant or qty<1 or variant.stock<qty:
                return Response({"detail":f"Insufficient stock for {p.name} ({size}/{color})."},409)
            subtotal += p.price*qty
            order_lines.append((p,variant,qty))
        discount=Decimal("0")
        if coupon_code:
            c=Coupon.objects.select_for_update().filter(code=coupon_code,active=True).first()
            if c:
                discount=Decimal(str(c.calculate(subtotal)))
        shipping_fee = Decimal("0") if subtotal >= Decimal("2499") else Decimal("199")
        if shipping_method == "priority": shipping_fee += Decimal("150")
        total=max(Decimal("0"),subtotal-discount+shipping_fee)
        order=Order.objects.create(
            user=request.user,order_number=_make_order_number(),subtotal=subtotal,discount=discount,
            shipping_fee=shipping_fee,total=total,payment_method=payment_method,
            payment_status="cod_pending" if payment_method=="cod" else "created",
            order_status="confirmed" if payment_method=="cod" else "pending",coupon_code=coupon_code,
            shipping_name=shipping["fullName"],shipping_email=shipping["email"],shipping_phone=shipping["phone"],
            address_line1=shipping["addressLine1"],address_line2=shipping.get("addressLine2",""),
            city=shipping["city"],state=shipping["state"],pincode=shipping["pincode"])
        for p,v,qty in order_lines:
            OrderItem.objects.create(order=order,product=p,product_name=p.name,unit_price=p.price,size=v.size,color_name=v.color_name,color_hex=v.color_hex,quantity=qty)
        if coupon_code and c:
            c.used_count += 1
            c.save(update_fields=["used_count"])
        if payment_method=="cod":
            for _,v,qty in order_lines:
                v.stock-=qty; v.save(update_fields=["stock"])
        else:
            if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
                order.delete()
                return Response({"detail":"Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env."},503)
            client=razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))
            rp=client.order.create({"amount":int(total*100),"currency":"INR","receipt":order.order_number,"notes":{"order_number":order.order_number}})
            order.razorpay_order_id=rp["id"]; order.save(update_fields=["razorpay_order_id"])
    return Response({"orderId":order.id,"orderNumber":order.order_number,"amount":str(order.total),"currency":"INR","razorpayOrderId":order.razorpay_order_id,"razorpayKeyId":settings.RAZORPAY_KEY_ID,"paymentMethod":payment_method},201)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    order=Order.objects.filter(id=request.data.get("orderId"),user=request.user).first()
    if not order: return Response({"detail":"Order not found."},404)
    if order.payment_method!="razorpay": return Response({"detail":"Not a Razorpay order."},400)
    payload={k:request.data.get(k,"") for k in ("razorpay_order_id","razorpay_payment_id","razorpay_signature")}
    if payload["razorpay_order_id"]!=order.razorpay_order_id: return Response({"detail":"Order mismatch."},400)
    expected=hmac.new(settings.RAZORPAY_KEY_SECRET.encode(),f'{payload["razorpay_order_id"]}|{payload["razorpay_payment_id"]}'.encode(),hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected,payload["razorpay_signature"]): return Response({"detail":"Payment signature verification failed."},400)
    with transaction.atomic():
        locked=Order.objects.select_for_update().prefetch_related("items__product").get(pk=order.pk)
        if locked.payment_status!="paid":
            for line in locked.items.all():
                v=ProductVariant.objects.select_for_update().filter(product=locked.items.get(pk=line.pk).product,size=line.size,color_name=line.color_name).first()
                if not v or v.stock<line.quantity: return Response({"detail":f"Stock changed for {line.product_name}. Contact support."},409)
            for line in locked.items.all():
                v=ProductVariant.objects.select_for_update().get(product=line.product,size=line.size,color_name=line.color_name)
                v.stock-=line.quantity; v.save(update_fields=["stock"])
            locked.payment_status="paid"; locked.order_status="confirmed"; locked.razorpay_payment_id=payload["razorpay_payment_id"]; locked.save()
    return Response({"success":True,"orderNumber":order.order_number})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    qs=Order.objects.filter(user=request.user).prefetch_related("items__product__images")
    return Response(OrderSerializer(qs,many=True,context={"request":request}).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request,slug):
    p=Product.objects.filter(slug=slug,active=True).first()
    if not p: return Response({"detail":"Product not found"},404)
    r=Review.objects.create(product=p,user=request.user,rating=int(request.data.get("rating",5)),title=request.data.get("title",""),comment=request.data.get("comment",""),verified=OrderItem.objects.filter(order__user=request.user,product=p,order__payment_status="paid").exists())
    return Response(ReviewSerializer(r).data,201)

@csrf_exempt
def razorpay_webhook(request):
    if request.method!="POST": return HttpResponse(status=405)
    if not settings.RAZORPAY_WEBHOOK_SECRET: return HttpResponse(status=503)
    signature=request.headers.get("X-Razorpay-Signature","")
    expected=hmac.new(settings.RAZORPAY_WEBHOOK_SECRET.encode(),request.body,hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected,signature): return HttpResponse(status=400)
    try: payload=json.loads(request.body)
    except: return HttpResponse(status=400)
    event=payload.get("event","")
    if event=="payment.captured":
        payment=payload.get("payload",{}).get("payment",{}).get("entity",{})
        rp_order=payment.get("order_id")
        order=Order.objects.filter(razorpay_order_id=rp_order).first()
        if order and order.payment_status!="paid":
            with transaction.atomic():
                locked=Order.objects.select_for_update().prefetch_related("items").get(pk=order.pk)
                for line in locked.items.all():
                    v=ProductVariant.objects.select_for_update().filter(product=line.product,size=line.size,color_name=line.color_name).first()
                    if not v or v.stock < line.quantity:
                        locked.payment_status="paid"
                        locked.order_status="pending"
                        locked.razorpay_payment_id=payment.get("id","")
                        locked.save()
                        return HttpResponse(status=200)
                for line in locked.items.all():
                    v=ProductVariant.objects.select_for_update().get(product=line.product,size=line.size,color_name=line.color_name)
                    v.stock-=line.quantity; v.save(update_fields=["stock"])
                locked.payment_status="paid"; locked.order_status="confirmed"; locked.razorpay_payment_id=payment.get("id",""); locked.save()
    return HttpResponse(status=200)
