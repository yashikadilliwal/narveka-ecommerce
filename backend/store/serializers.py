from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Review, Address, WishlistItem, Order, OrderItem

User=get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta: model=Category; fields=["id","name","slug","active","sort_order"]

class VariantSerializer(serializers.ModelSerializer):
    class Meta: model=ProductVariant; fields=["id","size","color_name","color_hex","stock"]

class ImageSerializer(serializers.ModelSerializer):
    url=serializers.SerializerMethodField()
    class Meta: model=ProductImage; fields=["id","url","alt","sort_order"]
    def get_url(self,obj):
        request=self.context.get("request")
        if obj.external_url: return obj.external_url
        return request.build_absolute_uri(obj.image.url) if request and obj.image else (obj.image.url if obj.image else "")

class ReviewSerializer(serializers.ModelSerializer):
    author=serializers.CharField(source="user.get_full_name",read_only=True)
    date=serializers.DateTimeField(source="created_at",read_only=True)
    class Meta: model=Review; fields=["id","author","rating","date","title","comment","verified"]

class ProductSerializer(serializers.ModelSerializer):
    id=serializers.CharField(source="slug",read_only=True)
    categoryLabel=serializers.CharField(source="category.name",read_only=True)
    category=serializers.CharField(source="category.slug")
    originalPrice=serializers.DecimalField(source="original_price",max_digits=10,decimal_places=2,allow_null=True)
    isNew=serializers.BooleanField(source="is_new")
    isBestSeller=serializers.BooleanField(source="is_best_seller")
    images=ImageSerializer(many=True,read_only=True)
    variants=VariantSerializer(many=True,read_only=True)
    colors=serializers.SerializerMethodField()
    sizes=serializers.SerializerMethodField()
    stock=serializers.SerializerMethodField()
    reviews=ReviewSerializer(many=True,read_only=True)
    rating=serializers.SerializerMethodField()
    reviewsCount=serializers.SerializerMethodField()
    class Meta:
        model=Product
        fields=["id","name","tagline","slug","price","originalPrice","category","categoryLabel","colors","sizes","images","description","details","fabric","gsm","fit","isNew","isBestSeller","rating","reviewsCount","stock","reviews","variants"]
    def get_colors(self,obj):
        seen={}
        for v in obj.variants.all():
            seen[v.color_name]=v.color_hex
        return [{"name":n,"hex":h} for n,h in seen.items()]
    def get_sizes(self,obj):
        return list(dict.fromkeys(v.size for v in obj.variants.all()))
    def get_stock(self,obj):
        return {v.size:v.stock for v in obj.variants.all()}
    def get_rating(self,obj):
        vals=[r.rating for r in obj.reviews.all()]
        return round(sum(vals)/len(vals),1) if vals else 0
    def get_reviewsCount(self,obj): return obj.reviews.count()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields=["id","full_name","email","phone","address_line1","address_line2","city","state","pincode","is_default"]
    def to_representation(self,instance):
        d=super().to_representation(instance)
        return {"id":d["id"],"fullName":d["full_name"],"email":d["email"],"phone":d["phone"],"addressLine1":d["address_line1"],"addressLine2":d["address_line2"],"city":d["city"],"state":d["state"],"pincode":d["pincode"],"isDefault":d["is_default"]}

class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField()
    phone=serializers.SerializerMethodField()
    class Meta: model=User; fields=["id","name","email","phone"]
    def get_name(self,obj): return obj.get_full_name() or obj.username
    def get_phone(self,obj): return getattr(getattr(obj,"profile",None),"phone","")

class OrderItemSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    class Meta: model=OrderItem; fields=["id","product_name","unit_price","size","color_name","color_hex","quantity","image"]
    def get_image(self,obj):
        image=obj.product.images.first()
        request=self.context.get("request")
        return request.build_absolute_uri(image.image.url) if image and request else (image.image.url if image else "")

class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    class Meta:
        model=Order
        fields=["id","order_number","subtotal","discount","shipping_fee","total","payment_method","payment_status","order_status","coupon_code","tracking_number","created_at","items","shipping_name","shipping_email","shipping_phone","address_line1","address_line2","city","state","pincode"]
