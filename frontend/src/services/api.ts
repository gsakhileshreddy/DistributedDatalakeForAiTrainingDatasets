import axios from 'axios';
import {
    Dataset,
    DatasetVersion,
    DatasetValidationReport,
    ProcessingJob,
    StorageMetrics,
    AITrainingJob,
    User,
    AuditLog,
    NotificationItem,
    DatasetFile
} from '../types';

// Mock Initial Data Engine
export const mockDatasets: Dataset[] = [
    {
        id: 'ds-1',
        name: 'Customer Image Classification',
        description: 'High-resolution retail customer interaction images annotated for demographic and sentiment analytics.',
        type: 'IMAGE',
        sizeBytes: 904123567800,
        sizeFormatted: '842 GB',
        fileCount: 2400000,
        recordCount: 2400000,
        latestVersion: 'v3',
        status: 'READY',
        updatedAt: '2 hours ago',
        createdAt: '2026-08-10',
        owner: 'Alex Rivera',
        ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        tags: ['Vision', 'Classification', 'Retail', 'Prod'],
        license: 'Apache-2.0',
        language: 'N/A',
        domain: 'Computer Vision',
        classesCount: 120,
        qualityScore: 96.7,
        storageLocation: 's3://datalake-ai-us-east-1/customer-images/'
    },
    {
        id: 'ds-2',
        name: 'Multilingual LLM Training Corpus',
        description: 'Cleaned web crawl dataset spanning 42 languages, tokenized and deduplicated for foundation model pre-training.',
        type: 'TEXT',
        sizeBytes: 1530000000000,
        sizeFormatted: '1.42 TB',
        fileCount: 1850000,
        recordCount: 48000000,
        latestVersion: 'v5',
        status: 'READY',
        updatedAt: '45 mins ago',
        createdAt: '2026-07-15',
        owner: 'Elena Rostova',
        ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        tags: ['NLP', 'Pre-training', 'Multilingual', 'LLM'],
        license: 'CC-BY-4.0',
        language: '42 Languages',
        domain: 'Natural Language Processing',
        classesCount: 0,
        qualityScore: 98.2,
        storageLocation: 's3://datalake-ai-eu-west-1/llm-corpus-v5/'
    },
    {
        id: 'ds-3',
        name: 'Autonomous Vehicle Audio Telemetry',
        description: 'Multi-microphone acoustic recordings from edge sensors for acoustic anomaly detection in autonomous driving.',
        type: 'AUDIO',
        sizeBytes: 429496729600,
        sizeFormatted: '400 GB',
        fileCount: 350000,
        recordCount: 350000,
        latestVersion: 'v2',
        status: 'PROCESSING',
        updatedAt: 'Just now',
        createdAt: '2026-08-20',
        owner: 'Marcus Vance',
        ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        tags: ['Acoustics', 'Autonomous Vehicles', 'Sensors'],
        license: 'Proprietary',
        language: 'N/A',
        domain: 'Sensor Processing',
        classesCount: 35,
        qualityScore: 91.4,
        storageLocation: 's3://datalake-ai-us-west-2/av-audio-telemetry/'
    },
    {
        id: 'ds-4',
        name: 'Financial Fraud Detection Tabular',
        description: 'Time-series banking transaction logs with synthetic edge cases for real-time fraud prevention neural nets.',
        type: 'TABULAR',
        sizeBytes: 193273528320,
        sizeFormatted: '180 GB',
        fileCount: 12000,
        recordCount: 150000000,
        latestVersion: 'v4',
        status: 'READY',
        updatedAt: '1 day ago',
        createdAt: '2026-06-01',
        owner: 'Alex Rivera',
        ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        tags: ['FinTech', 'Tabular', 'Fraud', 'Time-series'],
        license: 'Internal Enterprise',
        language: 'N/A',
        domain: 'Financial AI',
        qualityScore: 99.1,
        storageLocation: 's3://datalake-ai-us-east-1/fraud-detection-v4/'
    },
    {
        id: 'ds-5',
        name: 'Robotics Spatial Video Feeds',
        description: 'Stereo RGB-D 4K video feeds from factory floor arm robotics for 3D spatial motion planning.',
        type: 'VIDEO',
        sizeBytes: 644245094400,
        sizeFormatted: '600 GB',
        fileCount: 45000,
        recordCount: 45000,
        latestVersion: 'v1',
        status: 'FAILED',
        updatedAt: '3 hours ago',
        createdAt: '2026-08-28',
        owner: 'Devon Chen',
        ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        tags: ['Robotics', 'Spatial Vision', '3D Video'],
        license: 'CC0',
        language: 'N/A',
        domain: 'Robotics',
        qualityScore: 78.3,
        storageLocation: 's3://datalake-ai-ap-southeast-1/robotics-video-v1/'
    }
];

export const mockVersions: DatasetVersion[] = [
    {
        version: 'v3',
        createdAt: 'Aug 30, 2026',
        sizeFormatted: '842 GB',
        fileCount: 2400000,
        recordCount: 2400000,
        duplicateCount: 12430,
        qualityScore: 96.7,
        changesDescription: 'Added 200,000 retail store images, executed deduplication and automated blur filter.',
        isCurrent: true
    },
    {
        version: 'v2',
        createdAt: 'Aug 24, 2026',
        sizeFormatted: '810 GB',
        fileCount: 2200000,
        recordCount: 2200000,
        duplicateCount: 15200,
        qualityScore: 94.2,
        changesDescription: 'Re-indexed metadata tags and updated class definitions for 12 new demographic categories.'
    },
    {
        version: 'v1',
        createdAt: 'Aug 10, 2026',
        sizeFormatted: '650 GB',
        fileCount: 1800000,
        recordCount: 1800000,
        duplicateCount: 28400,
        qualityScore: 89.5,
        changesDescription: 'Initial ingestion from raw S3 bucket dump.'
    }
];

export const mockValidationReport: DatasetValidationReport = {
    datasetId: 'ds-1',
    datasetName: 'Customer Image Classification',
    qualityScore: 96.7,
    totalFiles: 150,
    validFiles: 146,
    invalidFiles: 4,
    totalRecords: 2400000,
    duplicateRecords: 12430,
    missingValues: 4120,
    corruptedFiles: 4,
    schemaValid: true,
    issues: [
        {
            id: 'iss-1',
            severity: 'HIGH',
            category: 'Corrupted',
            description: '4 JPEG files failed header decompression check due to truncated payload.',
            affectedCount: 4
        },
        {
            id: 'iss-2',
            severity: 'MEDIUM',
            category: 'Duplicates',
            description: '12,430 image hashes match higher-resolution counterparts in v2 version.',
            affectedCount: 12430
        },
        {
            id: 'iss-3',
            severity: 'LOW',
            category: 'Outliers',
            description: '4,120 bounding box metadata entries are missing confidence scores above 0.85 threshold.',
            affectedCount: 4120
        }
    ]
};

export const mockProcessingJobs: ProcessingJob[] = [
    {
        id: 'job-9021',
        datasetId: 'ds-3',
        datasetName: 'Autonomous Vehicle Audio Telemetry',
        operation: 'Spark Deduplication & Parquet Encoding',
        status: 'RUNNING',
        progressPercent: 68,
        startedAt: '10:42:01 AM',
        durationFormatted: '4m 22s',
        initiatedBy: 'Marcus Vance',
        logs: [
            '10:42:01 INFO Distributed Spark context initialized with 64 executors.',
            '10:42:05 INFO Reading S3 dataset partition s3://datalake-ai-us-west-2/av-audio-telemetry/raw/',
            '10:42:12 INFO 350,000 audio files loaded across 16 nodes.',
            '10:42:18 INFO Computing spectral hash embeddings for duplicate detection...',
            '10:42:42 INFO 12,430 duplicate frames identified.',
            '10:43:02 INFO Writing optimized Snappy-compressed Parquet tables to target storage...',
            '10:43:24 IN_PROGRESS Processing partition 68 of 100...'
        ]
    },
    {
        id: 'job-9020',
        datasetId: 'ds-2',
        datasetName: 'Multilingual LLM Training Corpus',
        operation: 'BPE Tokenizer Ingestion & Deduplication',
        status: 'COMPLETED',
        progressPercent: 100,
        startedAt: '08:15:00 AM',
        durationFormatted: '18m 45s',
        initiatedBy: 'Elena Rostova',
        logs: [
            '08:15:00 INFO Initializing HuggingFace BPE Tokenizer engine.',
            '08:20:12 INFO 48,000,000 text records tokenized.',
            '08:31:05 INFO Deduplication scan completed with zero index errors.',
            '08:33:45 SUCCESS Job completed successfully. Version v5 generated.'
        ]
    },
    {
        id: 'job-9019',
        datasetId: 'ds-5',
        datasetName: 'Robotics Spatial Video Feeds',
        operation: 'Frame Extraction & Quality Check',
        status: 'FAILED',
        progressPercent: 32,
        startedAt: '07:30:10 AM',
        durationFormatted: '2m 10s',
        initiatedBy: 'Devon Chen',
        logs: [
            '07:30:10 INFO Starting OpenCV ffmpeg frame extractor worker.',
            '07:31:00 INFO Processing stereo video stream chunk 042.',
            '07:32:20 ERROR Malformed MP4 atom box in file robot_feed_098.mp4. Execution aborted.',
            '07:32:20 FATAL Job failed with non-zero exit code (139).'
        ],
        error: 'Malformed MP4 atom box in file robot_feed_098.mp4. Decoding failed.'
    },
    {
        id: 'job-9018',
        datasetId: 'ds-1',
        datasetName: 'Customer Image Classification',
        operation: 'Automated Metadata Quality Scan',
        status: 'QUEUED',
        progressPercent: 0,
        startedAt: 'Pending',
        durationFormatted: '0s',
        initiatedBy: 'Alex Rivera',
        logs: [
            'Job queued in priority cluster queue #2.'
        ]
    }
];

export const mockStorageMetrics: StorageMetrics = {
    totalBytes: 3848290697216,
    usedBytes: 3122502696960,
    availableBytes: 725788000256,
    usedPercentage: 81.1,
    objectCount: 4850200,
    storageByDatasetType: [
        { type: 'TEXT', bytes: 1561251348480, percentage: 50.0 },
        { type: 'IMAGE', bytes: 925690798080, percentage: 29.6 },
        { type: 'VIDEO', bytes: 644245094400, percentage: 20.6 },
        { type: 'AUDIO', bytes: 429496729600, percentage: 13.7 },
        { type: 'TABULAR', bytes: 193273528320, percentage: 6.1 }
    ],
    storageByFileType: [
        { extension: '.parquet', bytes: 1288490188800, percentage: 41.2 },
        { extension: '.jpg / .png', bytes: 925690798080, percentage: 29.6 },
        { extension: '.jsonl', bytes: 536870912000, percentage: 17.2 },
        { extension: '.mp4 / .wav', bytes: 375809638400, percentage: 12.0 }
    ],
    usageTrend: [
        { date: 'Aug 25', usedTB: 2.31 },
        { date: 'Aug 26', usedTB: 2.45 },
        { date: 'Aug 27', usedTB: 2.58 },
        { date: 'Aug 28', usedTB: 2.64 },
        { date: 'Aug 29', usedTB: 2.72 },
        { date: 'Aug 30', usedTB: 2.79 },
        { date: 'Aug 31', usedTB: 2.84 }
    ]
};

export const mockTrainingJobs: AITrainingJob[] = [
    {
        id: 'train-101',
        modelName: 'ResNet-152 Vision Backbone',
        datasetId: 'ds-1',
        datasetName: 'Customer Image Classification',
        datasetVersion: 'v3',
        framework: 'PyTorch',
        epochs: 100,
        batchSize: 256,
        learningRate: 0.001,
        hardware: '8x NVIDIA H100 GPU',
        status: 'RUNNING',
        accuracyPercent: 94.8,
        startedAt: '3 hours ago',
        duration: '3h 12m'
    },
    {
        id: 'train-100',
        modelName: 'Llama-3-FineTune-CustomerSupport',
        datasetId: 'ds-2',
        datasetName: 'Multilingual LLM Training Corpus',
        datasetVersion: 'v5',
        framework: 'PyTorch',
        epochs: 5,
        batchSize: 32,
        learningRate: 0.0002,
        hardware: '8x NVIDIA H100 GPU',
        status: 'COMPLETED',
        accuracyPercent: 98.4,
        startedAt: 'Yesterday',
        duration: '14h 20m'
    },
    {
        id: 'train-99',
        modelName: 'Acoustic-X-Anomaly-Net',
        datasetId: 'ds-3',
        datasetName: 'Autonomous Vehicle Audio Telemetry',
        datasetVersion: 'v2',
        framework: 'TensorFlow',
        epochs: 50,
        batchSize: 128,
        learningRate: 0.0005,
        hardware: '4x NVIDIA A100 GPU',
        status: 'COMPLETED',
        accuracyPercent: 92.1,
        startedAt: '3 days ago',
        duration: '5h 45m'
    }
];

export const mockUsers: User[] = [
    {
        id: 'usr-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@datalake.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Admin',
        status: 'Active',
        datasetsOwnedCount: 14,
        lastActive: 'Now',
        createdAt: 'Jan 10, 2026'
    },
    {
        id: 'usr-2',
        name: 'Elena Rostova',
        email: 'elena.rostova@datalake.ai',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'Data Engineer',
        status: 'Active',
        datasetsOwnedCount: 22,
        lastActive: '12 mins ago',
        createdAt: 'Feb 01, 2026'
    },
    {
        id: 'usr-3',
        name: 'Marcus Vance',
        email: 'marcus.vance@datalake.ai',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'ML Engineer',
        status: 'Active',
        datasetsOwnedCount: 8,
        lastActive: '1 hour ago',
        createdAt: 'Mar 15, 2026'
    },
    {
        id: 'usr-4',
        name: 'Devon Chen',
        email: 'devon.chen@datalake.ai',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Viewer',
        status: 'Active',
        datasetsOwnedCount: 2,
        lastActive: '3 hours ago',
        createdAt: 'Apr 20, 2026'
    }
];

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-501',
        timestamp: '2026-08-31 10:42:01',
        user: 'Alex Rivera',
        userName: 'Alex Rivera',
        userEmail: 'alex.rivera@datalake.ai',
        action: 'DATASET_UPLOAD',
        resource: 'customer_images_v3.zip',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS'
    },
    {
        id: 'log-502',
        timestamp: '2026-08-31 09:15:33',
        user: 'Elena Rostova',
        userName: 'Elena Rostova',
        userEmail: 'elena.rostova@datalake.ai',
        action: 'VERSION_CREATED',
        resource: 'Multilingual LLM Corpus (v5)',
        ipAddress: '10.0.4.18',
        status: 'SUCCESS'
    },
    {
        id: 'log-503',
        timestamp: '2026-08-31 08:30:12',
        user: 'Marcus Vance',
        userName: 'Marcus Vance',
        userEmail: 'marcus.vance@datalake.ai',
        action: 'JOB_CANCELLED',
        resource: 'Job #9019 (Audio Telemetry)',
        ipAddress: '172.16.0.42',
        status: 'WARNING'
    },
    {
        id: 'log-504',
        timestamp: '2026-08-30 16:45:00',
        user: 'Devon Chen',
        userName: 'Devon Chen',
        userEmail: 'devon.chen@datalake.ai',
        action: 'API_KEY_GENERATED',
        resource: 'Production Inference Token',
        ipAddress: '192.168.1.188',
        status: 'SUCCESS'
    }
];

export const mockNotifications: NotificationItem[] = [
    {
        id: 'n-1',
        title: 'Processing Job Running',
        message: 'Spark Deduplication & Parquet Encoding job is at 68% for Autonomous Vehicle Audio Telemetry.',
        timestamp: '5m ago',
        read: false,
        type: 'info'
    },
    {
        id: 'n-2',
        title: 'Dataset Upload Complete',
        message: 'Customer Image Classification v3 (842 GB) has finished uploading successfully.',
        timestamp: '2h ago',
        read: false,
        type: 'success'
    },
    {
        id: 'n-3',
        title: 'Validation Warning',
        message: 'Robotics Spatial Video Feeds v1 reported 4 corrupted MP4 frame headers.',
        timestamp: '3h ago',
        read: true,
        type: 'warning'
    }
];

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// Service functions attempting live backend requests with graceful mock fallback
export const api = {
    getDatasets: async (): Promise<Dataset[]> => {
        try {
            const response = await apiClient.get('/datasets/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockDatasets;
        } catch {
            return mockDatasets;
        }
    },
    getDatasetById: async (id: string): Promise<Dataset> => {
        try {
            const response = await apiClient.get(`/datasets/${id}/`);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockDatasets.find(d => d.id === id) || mockDatasets[0];
        } catch {
            return mockDatasets.find(d => d.id === id) || mockDatasets[0];
        }
    },
    getVersions: async (datasetId?: string): Promise<DatasetVersion[]> => {
        try {
            const response = await apiClient.get('/versioning/versions/', { params: { dataset_id: datasetId } });
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockVersions;
        } catch {
            return mockVersions;
        }
    },
    getValidationReport: async (datasetId?: string): Promise<DatasetValidationReport> => {
        try {
            const response = await apiClient.get('/validation/reports/latest/', { params: { dataset_id: datasetId } });
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockValidationReport;
        } catch {
            return mockValidationReport;
        }
    },
    getJobs: async (): Promise<ProcessingJob[]> => {
        try {
            const response = await apiClient.get('/processing/jobs/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockProcessingJobs;
        } catch {
            return mockProcessingJobs;
        }
    },
    getStorageMetrics: async (): Promise<StorageMetrics> => {
        try {
            const response = await apiClient.get('/storage/metrics/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockStorageMetrics;
        } catch {
            return mockStorageMetrics;
        }
    },
    getTrainingJobs: async (): Promise<AITrainingJob[]> => {
        try {
            const response = await apiClient.get('/training/jobs/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockTrainingJobs;
        } catch {
            return mockTrainingJobs;
        }
    },
    getUsers: async (): Promise<User[]> => {
        try {
            const response = await apiClient.get('/users/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockUsers;
        } catch {
            return mockUsers;
        }
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        try {
            const response = await apiClient.get('/audit/logs/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockAuditLogs;
        } catch {
            return mockAuditLogs;
        }
    },
    getNotifications: async (): Promise<NotificationItem[]> => {
        try {
            const response = await apiClient.get('/notifications/');
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return mockNotifications;
        } catch {
            return mockNotifications;
        }
    },
};
