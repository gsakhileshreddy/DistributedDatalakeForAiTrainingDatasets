"""
Kafka Engine REST API Views
Architecture: Kafka + S3 + Spark + PostgreSQL + Python + SQL
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from apps.kafka_engine.producer import kafka_producer

class KafkaPublishEventView(APIView):
    """
    API endpoint to produce an event or streaming batch record to Kafka.
    """
    def post(self, request):
        topic_key = request.data.get('topic', 'DATASET_EVENTS')
        event_type = request.data.get('event_type', 'stream.record')
        payload = request.data.get('payload', {})
        key = request.data.get('key', None)

        if not payload:
            return Response({'error': 'Event payload is required'}, status=status.HTTP_400_BAD_REQUEST)

        event = kafka_producer.publish_event(
            topic_key=topic_key,
            event_type=event_type,
            payload=payload,
            key=key
        )

        return Response({
            'status': 'success',
            'message': f'Event successfully published to Kafka topic [{topic_key}]',
            'event': event
        }, status=status.HTTP_201_CREATED)


class KafkaEventHistoryView(APIView):
    """
    API endpoint to inspect recent Kafka stream event logs.
    """
    def get(self, request):
        topic = request.query_params.get('topic', None)
        events = kafka_producer.get_published_events(topic=topic)
        return Response({
            'total_count': len(events),
            'topic': topic or 'ALL',
            'events': events
        }, status=status.HTTP_200_OK)


class KafkaClusterStatusView(APIView):
    """
    API endpoint to return Kafka cluster metadata, active topics, and pipeline state.
    """
    def get(self, request):
        bootstrap_servers = getattr(settings, 'KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
        topics = getattr(settings, 'KAFKA_TOPICS', {})
        mock_fallback = getattr(settings, 'KAFKA_MOCK_FALLBACK', True)

        return Response({
            'architecture': 'Kafka + S3 + Spark + PostgreSQL + Python + SQL',
            'kafka_status': 'ONLINE (Mock Driver / Resilience Fallback)' if mock_fallback else 'ONLINE (Cluster connected)',
            'bootstrap_servers': bootstrap_servers,
            'client_id': getattr(settings, 'KAFKA_CLIENT_ID', 'datalake-backend-producer'),
            'mock_fallback_enabled': mock_fallback,
            'configured_topics': topics,
            'pipeline_components': {
                'ingestion': 'Apache Kafka Topics (dataset-ingestion-stream)',
                'processing': 'PySpark Structured Streaming',
                'storage_raw': 'S3 / MinIO Object Storage (Parquet / Multi-format)',
                'metadata_db': 'PostgreSQL Database Index'
            }
        }, status=status.HTTP_200_OK)
