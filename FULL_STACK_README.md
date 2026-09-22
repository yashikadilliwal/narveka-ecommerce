# NARVEKA Full-Stack Commerce

## Architecture
- Frontend: React + Vite + Tailwind
- Backend: Django + Django REST Framework
- Database: SQLite locally; PostgreSQL via `DATABASE_URL` in production
- Authentication: JWT
- Payments: Razorpay Checkout + server-side signature verification
- Admin: Django Admin

## Local setup

### 1. Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_catalog
python manage.py runserver
```

Admin: http://127.0.0.1:8000/admin/

### 2. Frontend
Open another terminal:
```bash
npm install
npm run dev
```

Frontend: http://localhost:5173/

The frontend automatically uses `http://127.0.0.1:8000/api` unless `VITE_API_URL` is set.

For Vercel:
```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

## Razorpay

Do not put the Razorpay secret in React.

Put your keys in `backend/.env`:
```text
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Use Razorpay TEST keys while developing. When the store is ready for real customer payments, replace them with your LIVE keys and configure the Razorpay webhook URL:

```text
https://YOUR-BACKEND-DOMAIN/api/payments/webhook/
```

The checkout creates a Razorpay order on the Django server and verifies the payment signature on the server before the order becomes paid.

## Admin workflow

From `/admin/` you can:
- create/edit products
- upload product images or use an external image URL
- create variants by size/color
- change stock
- change prices
- mark new arrivals / best sellers
- manage categories
- manage coupons
- view customer addresses
- view orders and update order/tracking status
- moderate reviews

## Production checklist

- Set `DEBUG=False`
- Use a strong `SECRET_KEY`
- Set real `ALLOWED_HOSTS`
- Set `CORS_ALLOWED_ORIGINS` to the production frontend only
- Use PostgreSQL
- Use HTTPS
- Set Razorpay LIVE keys only after completing Razorpay account/KYC requirements
- Configure media storage (S3/Cloudinary/etc.) for uploaded product images
- Configure Razorpay webhook
- Add email/SMS provider for order notifications if desired
- Back up the database
