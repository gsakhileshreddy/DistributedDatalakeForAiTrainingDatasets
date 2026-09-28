"""
Kafka Event Producer Implementation
Architecture: Kafka + S3 + Spark + PostgreSQL + Python + SQL
"""
import json
import logging
from typing import Any, Dict, Optional
from django.conf import settings
from apps.kafka_engine.events import create_kafka_event

logger = logging.getLogger(__name__)

# Attempt to load kafka driver
KAFKA_AVAILABLE = False
try:
    from kafka import KafkaProducer as PyKafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    try:
        from confluent_kafka import Producer as ConfluentProducer
        KAFKA_AVAILABLE = True
    except ImportError:
        KAFKA_AVAILABLE = False


class KafkaEventProducer:
    """
    Singleton / Unified Kafka Event Producer with mock fallback.
    Produces real events to Kafka broker if available, or buffers/logs them in mock mode.
    """
    _instance: Optional['KafkaEventProducer'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(KafkaEventProducer, cls).__new__(cls)
            cls._instance._init_producer()
        return cls._instance

    def _init_producer(self):
        self.bootstrap_servers = getattr(settings, 'KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
        self.mock_fallback = getattr(settings, 'KAFKA_MOCK_FALLBACK', True)
        self.producer = None
        self.published_events_history = []
        
        if KAFKA_AVAILABLE and not self.mock_fallback:
            try:
                self.producer = PyKafkaProducer(
                    bootstrap_servers=self.bootstrap_servers,
                    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                    key_serializer=lambda k: k.encode('utf-8') if k else None,
                    max_block_ms=3000
                )
                logger.info(f"Connected to Kafka broker at {self.bootstrap_servers}")
            except Exception as e:
                logger.warning(f"Could not connect to real Kafka broker ({e}). Falling back to Mock Producer.")
                self.producer = None

    def publish_event(self, topic_key: str, event_type: str, payload: Dict[str, Any], key: Optional[str] = None) -> Dict[str, Any]:
        """
        Publish an event to a target Kafka topic.
        """
        topics_map = getattr(settings, 'KAFKA_TOPICS', {})
        topic_name = topics_map.get(topic_key, topic_key)
        
        event_message = create_kafka_event(event_type=event_type, payload=payload)
        
        # Store in local memory log for inspection
        self.published_events_history.append({
            'topic': topic_name,
            'key': key,
            'event': event_message
        })
        if len(self.published_events_history) > 500:
            self.published_events_history.pop(0)

        if self.producer:
            try:
                self.producer.send(topic_name, key=key, value=event_message)
                self.producer.flush()
                logger.info(f"[KAFKA PUBLISH] Topic: {topic_name} | Event: {event_type} | ID: {event_message['event_id']}")
            except Exception as e:
                logger.error(f"Error producing event to Kafka topic {topic_name}: {e}")
        else:
            logger.info(f"[KAFKA MOCK PRODUCER] Topic: {topic_name} | Event: {event_type} | Payload: {json.dumps(payload)}")

        return event_message

    def get_published_events(self, topic: Optional[str] = None) -> list:
        """
        Retrieve recently produced events for debugging and UI inspection.
        """
        if topic:
            return [e for e in self.published_events_history if e['topic'] == topic]
        return list(self.published_events_history)


# Global helper instance
kafka_producer = KafkaEventProducer()
