

from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent



# SECRET_KEY = 'django-insecure-q^^wo#%n3jrco=_(*^l(tnmndfvo-3e0qvpapee9$d*bm_es8+'
SECRET_KEY = os.getenv('SECRET_KEY')


# DEBUG = True
DEBUG = os.getenv('DEBUG') == 'True'


# ALLOWED_HOSTS = [ '127.0.0.1', 'localhost',]
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')


# Frontend Url for CORS
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:5173",

# ]
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS').split(',')


# CSRF_TRUSTED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:5173",
# ]
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS').split(',')


# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True

# DOMAIN = 'localhost:5173'
# SITE_NAME = 'localhost:5173'
DOMAIN = os.getenv('DOMAIN')
SITE_NAME = os.getenv('SITE_NAME')



# Custom User Model
AUTH_USER_MODEL = 'auth_api.User'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'base.apps.BaseConfig',
    'corsheaders',
    'djoser',
    # 'social_django',
    'auth_api',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    'cloudinary',
    'cloudinary_storage',

]

MIDDLEWARE = [
    # "social_django.middleware.SocialAuthExceptionMiddleware", # social
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware", # CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # 'social_django.context_processors.backends',   # ✅ ADD
                # 'social_django.context_processors.login_redirect',  # ✅ ADD
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('DB_NAME'),
        "USER": os.getenv('DB_USER'),
        "PASSWORD": os.getenv('DB_PASSWORD'),
        "HOST": os.getenv('DB_HOST'),
        "PORT": os.getenv('DB_PORT'),

        # "OPTIONS": {
        #     "options": "-c search_path=newschema"
        # }
    }
}



# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# LOGIN_URL='/login'
# LOGIN_REDIRECT_URL = '/'
# LOGOUT_REDIRECT_URL = '/'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# MEDIA_URL = 'media/'
# MEDIA_ROOT = BASE_DIR / 'mediafiles'

# coudinary image url 
# MEDIA_URL = 'https://res.cloudinary.com/dkorqoeca/'







# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'




# =============================================


AUTHENTICATION_BACKENDS = (
    # 'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)




# REST Framework & JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}

# JWT Setting 
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT', 'Bearer'),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1000),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True, # To enable : install 'rest_framework_simplejwt.token_blacklist' app
    'UPDATE_LAST_LOGIN': True,
}


# Djoser Configuration
DJOSER = {
    # -------- Core Auth --------
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'TOKEN_MODEL': None,  # Using JWT
    "SOCIAL_AUTH_TOKEN_STRATEGY": "djoser.social.token.jwt.TokenStrategy", # ADDed

    # -------- Activation --------
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'activate/{uid}/{token}',


    # -------- Email Notifications --------
    'SEND_CONFIRMATION_EMAIL': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,

    # -------- Password Reset --------
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': True,

    # -------- Serializers --------
    'SERIALIZERS': {
        'user_create': 'auth_api.serializers.UserCreateSerializer',
        'user': 'auth_api.serializers.UserSerializer',
        'current_user': 'auth_api.serializers.UserSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
    },

    # -------- Viewsets --------
    'VIEWSETS': {
        'user': 'auth_api.views.UserViewSet',
    },

    # -------- Email Classes --------
    'EMAIL': {
        'activation': 'auth_api.email.ActivationEmail',
        'confirmation': 'auth_api.email.ConfirmationEmail',
        'password_reset': 'auth_api.email.PasswordResetEmail',
        'password_changed_confirmation': 'auth_api.email.PasswordChangedConfirmationEmail',

    },

}



# Email Configuration
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # For development


EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS') == 'True'
EMAIL_HOST_USER =  os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')

FRONTEND_URL = os.getenv('FRONTEND_URL')


# SSLCOMMERZ_STORE_ID = 'teamr600c004f8da4d'
# SSLCOMMERZ_STORE_PASS = 'teamr600c004f8da4d@ssl'

SSLCOMMERZ_STORE_ID = os.getenv('SSLCOMMERZ_STORE_ID')
SSLCOMMERZ_STORE_PASS = os.getenv('SSLCOMMERZ_STORE_PASS')

import cloudinary
import cloudinary.uploader
import cloudinary.api

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'