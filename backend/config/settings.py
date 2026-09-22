from pathlib import Path
import os
import environ
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, True))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY", default="dev-only-change-me")
DEBUG = env("DEBUG", default=True)
ALLOWED_HOSTS = [h.strip() for h in env("ALLOWED_HOSTS", default="localhost,127.0.0.1").split(",") if h.strip()]

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "corsheaders", "rest_framework", "rest_framework_simplejwt", "store",
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [{
    "BACKEND":"django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS":{"context_processors":[
        "django.template.context_processors.request","django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {"default": dj_database_url.config(default=f"sqlite:///{BASE_DIR/'db.sqlite3'}", conn_max_age=600)}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE="en-us"
TIME_ZONE="Asia/Kolkata"
USE_I18N=True
USE_TZ=True

STATIC_URL="/static/"
STATIC_ROOT=BASE_DIR/"staticfiles"
MEDIA_URL="/media/"
MEDIA_ROOT=BASE_DIR/"media"
STATICFILES_STORAGE="whitenoise.storage.CompressedManifestStaticFilesStorage"

CORS_ALLOWED_ORIGINS=[x.strip() for x in env("CORS_ALLOWED_ORIGINS", default="http://localhost:5173").split(",") if x.strip()]
CSRF_TRUSTED_ORIGINS=CORS_ALLOWED_ORIGINS

REST_FRAMEWORK={
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}
from datetime import timedelta
SIMPLE_JWT={"ACCESS_TOKEN_LIFETIME": timedelta(hours=2), "REFRESH_TOKEN_LIFETIME": timedelta(days=7)}

RAZORPAY_KEY_ID=env("RAZORPAY_KEY_ID", default="")
RAZORPAY_KEY_SECRET=env("RAZORPAY_KEY_SECRET", default="")
RAZORPAY_WEBHOOK_SECRET=env("RAZORPAY_WEBHOOK_SECRET", default="")
FRONTEND_URL=env("FRONTEND_URL", default="http://localhost:5173")
DEFAULT_AUTO_FIELD="django.db.models.BigAutoField"
