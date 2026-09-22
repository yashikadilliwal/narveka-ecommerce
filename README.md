# NARVEKA — Modern. Minimal. You.

A premium React/Vite storefront backed by Django REST Framework, PostgreSQL-ready storage, JWT authentication, Django Admin, inventory, orders, reviews, coupons and Razorpay payment verification.

## Folders
- `src/` — NARVEKA storefront
- `backend/` — Django API + admin
- `FULL_STACK_README.md` — detailed setup/deployment notes

## Run locally

Backend:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_catalog
python manage.py runserver
```

Frontend:
```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.
Admin: `http://127.0.0.1:8000/admin/`.

## Payments
Razorpay is a real server-verified integration. Add Razorpay TEST keys to `backend/.env` for development. Switch to LIVE keys only after your Razorpay merchant account is ready. Never put the secret key in frontend code.

## Important
The uploaded project contained `node_modules`; the distributable ZIP should not include it. Run `npm install` after extracting.
