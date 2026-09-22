#!/usr/bin/env bash
set -o errexit
python manage.py makemigrations store
python manage.py migrate --noinput
python manage.py collectstatic --noinput
