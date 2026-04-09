# 🛒 E-Commerce Full Stack App

**Django + React + Render + Vercel + Cloudinary**

A production-ready full-stack E-Commerce platform with authentication, cart, orders, payments, and image upload.

---

# 🚀 Live Architecture

```
Frontend (Vercel)
        ↓
Django API (Render)
        ↓
PostgreSQL (Render)
        ↓
Cloudinary (Images)
```

---

# 📁 Project Structure

```
E_Commerce_Store/
├── Backend/        # Django backend
│   ├── config/
│   ├── auth_api/
│   ├── base/
│   └── manage.py
│
├── frontend/       # React (Vite)
```

---

# ⚙️ Backend Setup (Django)

## 🔹 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔹 Environment Variables (.env)

Create `.env` inside **Backend/**:

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

---

# 🗄 Database (Render PostgreSQL)

1. Go to **Render → New → PostgreSQL**
2. Copy credentials
3. Add to `.env`

---

## 🔹 Django Config

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('DB_NAME'),
        "USER": os.getenv('DB_USER'),
        "PASSWORD": os.getenv('DB_PASSWORD'),
        "HOST": os.getenv('DB_HOST'),
        "PORT": os.getenv('DB_PORT'),
    }
}
```

---

# ☁️ Cloudinary (Image Upload)

## 🔹 Install

```bash
pip install cloudinary django-cloudinary-storage
```

---

## 🔹 Settings

```python
INSTALLED_APPS += [
    'cloudinary',
    'cloudinary_storage',
]

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUD_NAME'),
    'API_KEY': os.getenv('API_KEY'),
    'API_SECRET': os.getenv('API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

---

## ⚠️ Important

❌ Remove local media usage:

```python
# DO NOT use in production
MEDIA_ROOT
MEDIA_URL
```

---

# 🔐 Authentication (JWT + Custom User)

* Custom user model (`auth_api.User`)
* Login uses **email**

```python
DJOSER = {
    'LOGIN_FIELD': 'email',
}
```

---

## 🔹 Login API

```
POST /auth/jwt/create/
```

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

# 🛍 Features

## ✔ Product System

* Create / update products
* Filter / search / sort
* Top products

## ✔ Cart System

* Add / update / remove items
* Sync cart

## ✔ Order System

* Place order
* Stock management
* Auto cancel expired orders

## ✔ Payment

* PayPal
* SSLCommerz

## ✔ Reviews

* Only after purchase
* Rating + image upload

---

# 🎨 Static Files Fix (Admin UI)

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]
```

```python
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

---

# 🚀 Backend Deployment (Render)

## 🔹 Service Settings

* Type: **Web Service**
* Root Directory: *(leave empty OR project root)*

---

## 🔹 Build Command ✅

```bash
pip install -r requirements.txt && python Backend/manage.py migrate && python Backend/manage.py collectstatic --noinput
```

---

## 🔹 Start Command ✅

```bash
gunicorn --chdir Backend config.wsgi:application
```

---

# 🌐 Frontend Setup (React + Vite)

## 🔹 Environment

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔹 API Usage

```js
const API = import.meta.env.VITE_API_URL;

axios.post(`${API}/api/orders/`, data);
```

---

## 🔹 Auth Header

```js
Authorization: `Bearer ${token}`
```

---

# 🚀 Frontend Deployment (Vercel)

1. Import repo
2. Set:

```
Root Directory = frontend
```

3. Add ENV:

```env
VITE_API_URL=https://your-backend.onrender.com
```

4. Deploy

---

# 🔐 CORS & CSRF (IMPORTANT)

```env
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app
```

⚠️ No trailing `/`

---

# 🔥 Final Architecture

```
Frontend (Vercel)
        ↓
Backend API (Render)
        ↓
PostgreSQL (Render)
        ↓
Cloudinary (Images)
```

---

# ✅ Deployment Checklist

* [x] Backend deployed (Render)
* [x] PostgreSQL connected
* [x] Cloudinary configured
* [x] Frontend deployed (Vercel)
* [x] JWT authentication working
* [x] Orders + payments working

---

# ⚠️ Notes

* Use **email instead of username**
* Local media ❌ not supported on Render
* Always redeploy after changing ENV
* Always use Cloudinary for images

---

# 👨‍💻 Author

**Md Hasibul Hasan**

---

# ⭐ Optional Improvements

* Add screenshots
* Add API documentation
* Add Swagger / OpenAPI
* Add CI/CD

---

🚀 Your E-Commerce app is now **fully production-ready**
