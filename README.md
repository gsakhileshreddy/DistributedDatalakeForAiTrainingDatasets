# Distributed Data Lake for AI Training Datasets

Enterprise multi-format data lake platform with real-time stream ingestion, automated data quality scoring, dataset versioning, distributed processing, and interactive monitoring UI.

## 🏗️ Architecture Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Python 3.11, Django, Django REST Framework, Django Channels
- **Streaming Engine**: Apache Kafka (Zookeeper, Kafka Topics, Producer & Consumer APIs)
- **Processing Engine**: PySpark Structured Streaming engine (`spark_kafka_stream.py`)
- **Object Storage**: S3 API (MinIO Distributed Object Store for Parquet & raw datasets)
- **Database**: PostgreSQL (Relational metadata index & transactional state)
- **Containerization**: Docker Compose

---

## 📁 Project Structure

```text
.
├── frontend/               # React + Vite + TypeScript Enterprise Frontend UI
├── backend/                # Django REST API Backend & Event Engine
│   ├── apps/               # Django Apps (kafka_engine, datasets, storage, etc.)
│   ├── config/             # Django settings & routing
│   └── spark_kafka_stream.py # PySpark Structured Streaming Pipeline
├── docker-compose.yml      # Orchestration for Kafka, MinIO, Postgres, Spark & Backend
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Run full infrastructure via Docker Compose
```bash
docker-compose up -d
```

### 2. Start Backend Development Server (Local)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt  # or install django rest_framework corsheaders
python manage.py runserver
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

### 4. Run PySpark Streaming Processor
```bash
python backend/spark_kafka_stream.py
```
