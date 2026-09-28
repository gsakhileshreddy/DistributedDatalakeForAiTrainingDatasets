from django.apps import AppConfig

class KafkaEngineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.kafka_engine'
    verbose_name = 'Kafka Event Engine & Streaming'
