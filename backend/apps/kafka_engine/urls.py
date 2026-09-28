"""
Kafka Engine URL Routing
Architecture: Kafka + S3 + Spark + PostgreSQL + Python + SQL
"""
from django.urls import path
from apps.kafka_engine.views import (
    KafkaPublishEventView,
    KafkaEventHistoryView,
    KafkaClusterStatusView,
)

urlpatterns = [
    path('kafka/publish/', KafkaPublishEventView.as_view(), name='kafka-publish'),
    path('kafka/events/', KafkaEventHistoryView.as_view(), name='kafka-events'),
    path('kafka/status/', KafkaClusterStatusView.as_view(), name='kafka-status'),
]
