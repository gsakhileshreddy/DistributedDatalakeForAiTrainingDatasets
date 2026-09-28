"""
Kafka Event Schemas & Types
Architecture: Kafka + S3 + Spark + PostgreSQL + Python + SQL
"""
import uuid
from datetime import datetime, timezone

# Standard Event Types
EVENT_DATASET_UPLOADED = 'dataset.uploaded'
EVENT_DATASET_INGESTED = 'dataset.ingested'
EVENT_VALIDATION_STARTED = 'validation.started'
EVENT_VALIDATION_COMPLETED = 'validation.completed'
EVENT_TRAINING_TRIGGERED = 'training.triggered'
EVENT_TRAINING_COMPLETED = 'training.completed'
EVENT_AUDIT_LOGGED = 'audit.logged'
EVENT_STREAM_RECORD = 'stream.record'


def create_kafka_event(event_type: str, payload: dict, source: str = 'datalake-api') -> dict:
    """
    Build a standardized Kafka JSON event message with UUID tracing.
    """
    return {
        'event_id': str(uuid.uuid4()),
        'event_type': event_type,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'source': source,
        'payload': payload,
    }
