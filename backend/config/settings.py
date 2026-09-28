"""
Django Settings for Distributed Data Lake for AI Training Datasets
Architecture: Kafka + S3 (MinIO) + Spark (PySpark) + PostgreSQL + Python (Django) + SQL
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-capstone-distributed-datalake-key-2026')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party packages
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    
    # Internal architecture apps
    'apps.accounts',
    'apps.datasets',
    'apps.storage',
    'apps.validation',
    'apps.versioning',
    'apps.processing',
    'apps.training',
    'apps.dashboard',
    'apps.notifications',
    'apps.audit',
    'apps.kafka_engine',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
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
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database Configuration (PostgreSQL with SQLite fallback)
USE_POSTGRES = os.environ.get('USE_POSTGRES', 'False').lower() == 'true'

if USE_POSTGRES:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB', 'datalake_db'),
            'USER': os.environ.get('POSTGRES_USER', 'datalake_user'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'datalake_password'),
            'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
            'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True

# OpenAPI Documentation
SPECTACULAR_SETTINGS = {
    'TITLE': 'Distributed Data Lake for AI Training Datasets API',
    'DESCRIPTION': 'Enterprise multi-format data lake with Kafka stream ingestion, S3 object storage, PySpark validation, and PostgreSQL metadata index.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# ==========================================
# Kafka Stream & Event Architecture Settings
# ==========================================
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_CLIENT_ID = 'datalake-backend-producer'
KAFKA_TOPICS = {
    'DATASET_EVENTS': os.environ.get('KAFKA_TOPIC_DATASETS', 'dataset-events'),
    'VALIDATION_EVENTS': os.environ.get('KAFKA_TOPIC_VALIDATION', 'validation-events'),
    'TRAINING_EVENTS': os.environ.get('KAFKA_TOPIC_TRAINING', 'training-events'),
    'AUDIT_EVENTS': os.environ.get('KAFKA_TOPIC_AUDIT', 'audit-events'),
    'STREAM_INGESTION': os.environ.get('KAFKA_TOPIC_STREAM_INGESTION', 'dataset-ingestion-stream'),
}

# Enable Mock Kafka Producer mode when local Kafka broker is offline
KAFKA_MOCK_FALLBACK = os.environ.get('KAFKA_MOCK_FALLBACK', 'True').lower() == 'true'

# ==========================================
# S3 / MinIO Object Storage Settings
# ==========================================
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', 'minioadmin')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', 'minioadmin')
AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL', 'http://localhost:9000')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'ai-training-datasets')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')

# ==========================================
# Spark / PySpark Architecture Settings
# ==========================================
SPARK_MASTER_URL = os.environ.get('SPARK_MASTER_URL', 'local[*]')
SPARK_APP_NAME = 'DataLake-PySpark-Engine'
