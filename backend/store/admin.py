from django.contrib import admin
from .models import Category,Product,ProductImage,ProductVariant,Review,Address,WishlistItem,Coupon,Order,OrderItem,SiteSetting,CustomerProfile

class ProductImageInline(admin.TabularInline):
    model=ProductImage
    extra=1
class ProductVariantInline(admin.TabularInline):
    model=ProductVariant
    extra=1
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=("name","category","price","active","is_new","is_best_seller","updated_at")
    list_filter=("category","active","is_new","is_best_seller")
    search_fields=("name","slug")
    prepopulated_fields={"slug":("name",)}
    inlines=[ProductImageInline,ProductVariantInline]
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=("order_number","user","total","payment_status","order_status","created_at","tracking_number")
    list_filter=("payment_status","order_status","payment_method")
    search_fields=("order_number","user__email","tracking_number")
    readonly_fields=("order_number","razorpay_order_id","razorpay_payment_id","created_at","updated_at")
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("name","slug","active","sort_order")
    prepopulated_fields={"slug":("name",)}
@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display=("product","size","color_name","stock")
    list_filter=("size","color_name")
    search_fields=("product__name","color_name")
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display=("code","percentage","fixed_amount","minimum_spend","active","used_count","usage_limit")
    list_filter=("active",)
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display=("product","user","rating","verified","created_at")
    list_filter=("rating","verified")
admin.site.register(ProductImage)
admin.site.register(Address)
admin.site.register(WishlistItem)
admin.site.register(OrderItem)
admin.site.register(SiteSetting)
admin.site.register(CustomerProfile)

admin.site.site_header="NARVEKA — Atelier Administration"
admin.site.site_title="NARVEKA Admin"
admin.site.index_title="Store Management"
