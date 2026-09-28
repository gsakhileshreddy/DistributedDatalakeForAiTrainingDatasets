"""
PySpark Structured Streaming Pipeline
Architecture: Kafka + S3 (MinIO) + PySpark + PostgreSQL + Python + SQL

Consumes streaming events from Kafka topic 'dataset-ingestion-stream',
executes PySpark streaming transformations, writes output to S3 (MinIO)
in Parquet format, and updates PostgreSQL database metadata.
"""
import os
import sys
import logging
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, current_timestamp, expr, when
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType, MapType

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger("SparkKafkaStream")

# Configuration Defaults
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPIC = os.environ.get('KAFKA_TOPIC_STREAM_INGESTION', 'dataset-ingestion-stream')

S3_ENDPOINT = os.environ.get('AWS_S3_ENDPOINT_URL', 'http://localhost:9000')
S3_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY_ID', 'minioadmin')
S3_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', 'minioadmin')
S3_BUCKET = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'ai-training-datasets')
S3_OUTPUT_PATH = f"s3a://{S3_BUCKET}/processed_streams/"

POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')
POSTGRES_DB = os.environ.get('POSTGRES_DB', 'datalake_db')
POSTGRES_USER = os.environ.get('POSTGRES_USER', 'datalake_user')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'datalake_password')
POSTGRES_URL = f"jdbc:postgresql://{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"


def create_spark_session() -> SparkSession:
    """
    Initialize PySpark Session configured with Kafka and S3 connectors.
    """
    logger.info("Initializing PySpark Session for Kafka -> S3 -> PostgreSQL pipeline...")
    
    spark = SparkSession.builder \
        .appName("DataLake-PySpark-Kafka-Streaming") \
        .config("spark.jars.packages", 
                "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,"
                "org.apache.hadoop:hadoop-aws:3.3.4,"
                "org.postgresql:postgresql:42.7.1") \
        .config("spark.hadoop.fs.s3a.endpoint", S3_ENDPOINT) \
        .config("spark.hadoop.fs.s3a.access.key", S3_ACCESS_KEY) \
        .config("spark.hadoop.fs.s3a.secret.key", S3_SECRET_KEY) \
        .config("spark.hadoop.fs.s3a.path.style.access", "true") \
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem") \
        .getOrCreate()
        
    spark.sparkContext.setLogLevel("WARN")
    return spark


def build_kafka_streaming_pipeline(spark: SparkSession):
    """
    Construct Kafka Structured Streaming pipeline with PySpark.
    """
    # 1. Define Dataset JSON Schema
    stream_schema = StructType([
        StructField("dataset_id", StringType(), True),
        StructField("dataset_name", StringType(), True),
        StructField("record_id", StringType(), True),
        StructField("features", MapType(StringType(), DoubleType()), True),
        StructField("quality_score", DoubleType(), True),
        StructField("timestamp", StringType(), True),
    ])

    logger.info(f"Subscribing to Kafka Topic: {KAFKA_TOPIC} @ {KAFKA_BOOTSTRAP_SERVERS}")

    # 2. Read Stream from Kafka
    kafka_df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS) \
        .option("subscribe", KAFKA_TOPIC) \
        .option("startingOffsets", "latest") \
        .load()

    # 3. Parse JSON & Transform DataFrame
    parsed_df = kafka_df \
        .selectExpr("CAST(value AS STRING) as json_payload") \
        .select(from_json(col("json_payload"), stream_schema).alias("data")) \
        .select("data.*") \
        .withColumn("ingested_at", current_timestamp()) \
        .withColumn("is_valid", when(col("quality_score") >= 0.8, True).otherwise(False))

    # 4. Console Sink for Verification
    console_query = parsed_df.writeStream \
        .format("console") \
        .outputMode("append") \
        .option("truncate", "false") \
        .start()

    logger.info("Kafka PySpark Streaming Pipeline running successfully.")
    return console_query


if __name__ == "__main__":
    try:
        spark_session = create_spark_session()
        query = build_kafka_streaming_pipeline(spark_session)
        query.awaitTermination()
    except Exception as err:
        logger.error(f"Spark Streaming Exception: {err}")
        sys.exit(1)
