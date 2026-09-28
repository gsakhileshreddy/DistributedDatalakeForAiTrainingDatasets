from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from common.views.health import HealthCheckView, ReadinessCheckView

def root_view(request):
    return JsonResponse({
        "status": "online",
        "name": "Distributed Data Lake for AI Training Datasets API",
        "version": "1.0.0",
        "documentation": "/api/docs/",
        "health": "/api/v1/health/",
        "admin": "/admin/",
        "endpoints": {
            "auth": "/api/v1/auth/login/",
            "datasets": "/api/v1/datasets/",
            "storage": "/api/v1/storage/metrics/",
            "validation": "/api/v1/validation/reports/",
            "versioning": "/api/v1/versioning/versions/",
            "processing": "/api/v1/processing/jobs/",
            "training": "/api/v1/training/jobs/",
            "dashboard": "/api/v1/dashboard/stats/",
            "notifications": "/api/v1/notifications/",
            "audit": "/api/v1/audit/logs/"
        }
    })

urlpatterns = [
    # Root Index
    path('', root_view, name='root-index'),
    path('api/', root_view, name='api-index'),

    # Django Admin
    path('admin/', admin.site.urls),

    # Health Checks
    path('api/v1/health/', HealthCheckView.as_view(), name='health-check'),
    path('api/v1/ready/', ReadinessCheckView.as_view(), name='readiness-check'),

    # OpenAPI 3 Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Apps Router
    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.datasets.urls')),
    path('api/v1/', include('apps.storage.urls')),
    path('api/v1/', include('apps.validation.urls')),
    path('api/v1/', include('apps.versioning.urls')),
    path('api/v1/', include('apps.processing.urls')),
    path('api/v1/', include('apps.training.urls')),
    path('api/v1/', include('apps.dashboard.urls')),
    path('api/v1/', include('apps.notifications.urls')),
    path('api/v1/', include('apps.audit.urls')),
    path('api/v1/', include('apps.kafka_engine.urls')),
]
