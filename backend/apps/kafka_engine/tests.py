"""
Unit Tests for Kafka Event Engine
Architecture: Kafka + S3 + Spark + PostgreSQL + Python + SQL
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.kafka_engine.events import create_kafka_event, EVENT_DATASET_UPLOADED
from apps.kafka_engine.producer import kafka_producer
from apps.kafka_engine.consumer import KafkaEventConsumer


class KafkaEngineTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_kafka_event_schema(self):
        payload = {'dataset_id': 'ds_101', 'name': 'ImageNet_Sample'}
        event = create_kafka_event(EVENT_DATASET_UPLOADED, payload)
        
        self.assertIn('event_id', event)
        self.assertEqual(event['event_type'], EVENT_DATASET_UPLOADED)
        self.assertEqual(event['payload']['dataset_id'], 'ds_101')
        self.assertEqual(event['source'], 'datalake-api')

    def test_kafka_producer_publish(self):
        payload = {'stream_key': 'k_001', 'value': 98.6}
        published_event = kafka_producer.publish_event(
            topic_key='STREAM_INGESTION',
            event_type='stream.record',
            payload=payload
        )
        self.assertEqual(published_event['payload']['stream_key'], 'k_001')
        
        history = kafka_producer.get_published_events()
        self.assertGreater(len(history), 0)

    def test_kafka_consumer_process_event(self):
        consumer = KafkaEventConsumer(group_id='test-consumer-group')
        processed_results = []
        
        def mock_handler(payload):
            processed_results.append(payload['value'])

        consumer.register_handler('test.event', mock_handler)
        
        test_event = create_kafka_event('test.event', {'value': 'kafka_success'})
        success = consumer.process_event(test_event)
        
        self.assertTrue(success)
        self.assertEqual(processed_results, ['kafka_success'])

    def test_kafka_cluster_status_api(self):
        response = self.client.get('/api/v1/kafka/status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('architecture', response.data)
        self.assertIn('configured_topics', response.data)

    def test_kafka_publish_api(self):
        data = {
            'topic': 'DATASET_EVENTS',
            'event_type': 'dataset.uploaded',
            'payload': {'dataset_name': 'Medical_Imaging_2026', 'records': 15000}
        }
        response = self.client.post('/api/v1/kafka/publish/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'success')
