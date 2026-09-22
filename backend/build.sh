#!/usr/bin/env bash
set -o errexit

python manage.py makemigrations
python manage.py migrate --noinput
python manage.py collectstatic --noinput

python manage.py shell <<'PY'
import os
from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "Narveka")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if password:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email}
    )
    user.email = email
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()

    print(f"Superuser {'created' if created else 'password reset'}: {username}")
else:
    print("DJANGO_SUPERUSER_PASSWORD is not set; skipping superuser setup.")
PY