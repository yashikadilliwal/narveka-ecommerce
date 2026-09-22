from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import products, product_detail, categories, register, me, AddressViewSet, WishlistViewSet, validate_coupon, create_order, verify_payment, my_orders, create_review

router=DefaultRouter()
router.register("addresses",AddressViewSet,basename="address")
router.register("wishlist",WishlistViewSet,basename="wishlist")

urlpatterns=[
    path("auth/register/",register),
    path("auth/login/",TokenObtainPairView.as_view()),
    path("auth/refresh/",TokenRefreshView.as_view()),
    path("auth/me/",me),
    path("products/",products),
    path("products/<slug:slug>/",product_detail),
    path("products/<slug:slug>/reviews/",create_review),
    path("categories/",categories),
    path("coupons/validate/",validate_coupon),
    path("orders/create/",create_order),
    path("orders/verify-payment/",verify_payment),
    path("orders/",my_orders),
    path("",include(router.urls)),
]
