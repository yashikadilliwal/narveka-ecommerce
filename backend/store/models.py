from django.conf import settings
from django.db import models
from django.utils.text import slugify

class CustomerProfile(models.Model):
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="profile")
    phone=models.CharField(max_length=30,blank=True)
    def __str__(self): return self.user.email

class Category(models.Model):
    name=models.CharField(max_length=120)
    slug=models.SlugField(unique=True)
    active=models.BooleanField(default=True)
    sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=["sort_order","name"]
    def __str__(self): return self.name

class Product(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField(unique=True)
    tagline=models.CharField(max_length=255,blank=True)
    category=models.ForeignKey(Category,on_delete=models.PROTECT,related_name="products")
    price=models.DecimalField(max_digits=10,decimal_places=2)
    original_price=models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    description=models.TextField()
    details=models.JSONField(default=list,blank=True)
    fabric=models.CharField(max_length=160,blank=True)
    gsm=models.CharField(max_length=80,blank=True)
    fit=models.CharField(max_length=160,blank=True)
    is_new=models.BooleanField(default=False)
    is_best_seller=models.BooleanField(default=False)
    active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta: ordering=["-created_at"]
    def __str__(self): return self.name

class ProductImage(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name="images")
    image=models.ImageField(upload_to="products/",blank=True,null=True)
    external_url=models.URLField(blank=True)
    alt=models.CharField(max_length=200,blank=True)
    sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=["sort_order","id"]
    def __str__(self): return f"{self.product.name} image"

class ProductVariant(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name="variants")
    size=models.CharField(max_length=10)
    color_name=models.CharField(max_length=80)
    color_hex=models.CharField(max_length=20,default="#0B0B0B")
    stock=models.PositiveIntegerField(default=0)
    class Meta:
        unique_together=("product","size","color_name")
    def __str__(self): return f"{self.product.name} / {self.size} / {self.color_name}"

class Review(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name="reviews")
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    rating=models.PositiveSmallIntegerField()
    title=models.CharField(max_length=160)
    comment=models.TextField()
    verified=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=["-created_at"]
    def __str__(self): return f"{self.product.name} - {self.rating}/5"

class Address(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="addresses")
    full_name=models.CharField(max_length=160)
    email=models.EmailField()
    phone=models.CharField(max_length=30)
    address_line1=models.CharField(max_length=255)
    address_line2=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    pincode=models.CharField(max_length=10)
    is_default=models.BooleanField(default=False)
    def save(self,*args,**kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user).exclude(pk=self.pk).update(is_default=False)
        super().save(*args,**kwargs)

class WishlistItem(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="wishlist")
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    added_at=models.DateTimeField(auto_now_add=True)
    class Meta: unique_together=("user","product")

class Coupon(models.Model):
    code=models.CharField(max_length=40,unique=True)
    percentage=models.DecimalField(max_digits=5,decimal_places=2,null=True,blank=True)
    fixed_amount=models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    minimum_spend=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    active=models.BooleanField(default=True)
    usage_limit=models.PositiveIntegerField(null=True,blank=True)
    used_count=models.PositiveIntegerField(default=0)
    def calculate(self,subtotal):
        if not self.active or subtotal < self.minimum_spend: return 0
        if self.percentage is not None: return min(subtotal, round(subtotal*self.percentage/100,2))
        return min(subtotal, self.fixed_amount or 0)
    def __str__(self): return self.code

class Order(models.Model):
    PAYMENT_CHOICES=[("razorpay","Razorpay"),("cod","Cash on Delivery")]
    STATUS=[("pending","Pending"),("confirmed","Confirmed"),("processing","Processing"),("shipped","Shipped"),("delivered","Delivered"),("cancelled","Cancelled")]
    PAYMENT_STATUS=[("created","Created"),("paid","Paid"),("failed","Failed"),("cod_pending","COD Pending"),("refunded","Refunded")]
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,related_name="orders")
    order_number=models.CharField(max_length=40,unique=True)
    subtotal=models.DecimalField(max_digits=10,decimal_places=2)
    discount=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    shipping_fee=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    total=models.DecimalField(max_digits=10,decimal_places=2)
    payment_method=models.CharField(max_length=20,choices=PAYMENT_CHOICES)
    payment_status=models.CharField(max_length=20,choices=PAYMENT_STATUS,default="created")
    order_status=models.CharField(max_length=20,choices=STATUS,default="pending")
    coupon_code=models.CharField(max_length=40,blank=True)
    razorpay_order_id=models.CharField(max_length=100,blank=True)
    razorpay_payment_id=models.CharField(max_length=100,blank=True)
    tracking_number=models.CharField(max_length=100,blank=True)
    shipping_name=models.CharField(max_length=160)
    shipping_email=models.EmailField()
    shipping_phone=models.CharField(max_length=30)
    address_line1=models.CharField(max_length=255)
    address_line2=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    pincode=models.CharField(max_length=10)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta: ordering=["-created_at"]
    def __str__(self): return self.order_number

class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name="items")
    product=models.ForeignKey(Product,on_delete=models.PROTECT)
    product_name=models.CharField(max_length=200)
    unit_price=models.DecimalField(max_digits=10,decimal_places=2)
    size=models.CharField(max_length=10)
    color_name=models.CharField(max_length=80)
    color_hex=models.CharField(max_length=20)
    quantity=models.PositiveIntegerField()
    def __str__(self): return f"{self.order.order_number} / {self.product_name}"

class SiteSetting(models.Model):
    key=models.CharField(max_length=100,unique=True)
    value=models.TextField(blank=True)
    def __str__(self): return self.key
