# E-Commerce Full-Stack App

Production-ready store built with **Django REST Framework + React (Vite)**. Hosted on **Render** (API + PostgreSQL) and **Vercel** (frontend) with **Cloudinary** for media, **PayPal** and **SSLCommerz** for payments.

Live demo: https://e-commerce-store-sigma-sable.vercel.app/

---

## Highlights
- Email-first authentication (custom user) with JWT via Djoser
- Product catalog with search, filters, sorting, ratings, and image uploads
- Cart, orders, stock control, and automatic cancellation of stale orders
- Payments: PayPal and SSLCommerz
- Optimized static handling with WhiteNoise; deployment-ready build commands

---

## Architecture
```
Vercel (React UI)
   ->
Render Web Service (Django API)
   ->
Render PostgreSQL
   ->
Cloudinary (media storage)
```

---

## Project Structure
```
E-Commerz/
|- Backend/    # Django project (config/, auth_api/, base/, manage.py)
|- frontend/   # React (Vite) app
```

---

## Backend Setup (Django)
### Prerequisites
- Python 3.12+
- PostgreSQL instance (local or hosted)

### Install dependencies
```bash
pip install -r requirements.txt
```

### Environment (Backend/.env)
```env
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=e-commerce-store.onrender.com

DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=5432

CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app

EMAIL_BACKEND=...
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_HOST_USER=...
EMAIL_HOST_PASSWORD=...
DEFAULT_FROM_EMAIL=...

CLOUD_NAME=...
API_KEY=...
API_SECRET=...

SSLCOMMERZ_STORE_ID=...
SSLCOMMERZ_STORE_PASS=...
```

### Database configuration
```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}
```

### Cloudinary media
```python
INSTALLED_APPS += ["cloudinary", "cloudinary_storage"]

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.getenv("CLOUD_NAME"),
    "API_KEY": os.getenv("API_KEY"),
    "API_SECRET": os.getenv("API_SECRET"),
}

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
```

### Static files (WhiteNoise)
```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    ...
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

### Run locally
```bash
python Backend/manage.py migrate
python Backend/manage.py createsuperuser
python Backend/manage.py runserver
```

---

## Auth (Email + JWT)
- Custom user model: `auth_api.User`
- Djoser with `LOGIN_FIELD = "email"`
- Obtain token:
```http
POST /auth/jwt/create/
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

## Frontend Setup (React + Vite)
### Environment (frontend/.env)
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Example usage
```js
const API = import.meta.env.VITE_API_URL;
axios.post(`${API}/api/orders/`, data, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Run locally
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment
### Backend on Render
- Service type: Web Service
- Build command:
```bash
pip install -r requirements.txt \
  && python Backend/manage.py migrate \
  && python Backend/manage.py shell -c "from auth_api.models import User; User.objects.filter(email='admin@gmail.com').exists() or User.objects.create_superuser(name='Admin', email='admin@gmail.com', password='admin')" \
  && python Backend/manage.py collectstatic --noinput
```
- Start command:
```bash
gunicorn --chdir Backend config.wsgi:application
```

### Frontend on Vercel
- Root directory: `frontend`
- Env: `VITE_API_URL=https://your-backend.onrender.com`

---

## Deployment Checklist
- [x] Backend deployed (Render)
- [x] PostgreSQL connected
- [x] Cloudinary configured
- [x] Frontend deployed (Vercel)
- [x] JWT auth verified
- [x] Orders and payments tested

---

## Maintenance Notes
- Redeploy after changing environment variables.
- Use Cloudinary for all media; avoid local `MEDIA_ROOT`/`MEDIA_URL` in production.
- Use email (not username) for login everywhere.

---

## Author
Md Hasibul Hasan

## Future Enhancements
- Add screenshots and visual walkthrough
- Publish Swagger/OpenAPI docs
- Add CI/CD pipeline
