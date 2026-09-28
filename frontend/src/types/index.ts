export type DatasetType = 'IMAGE' | 'TEXT' | 'AUDIO' | 'VIDEO' | 'TABULAR';
export type DatasetStatus = 'READY' | 'PROCESSING' | 'FAILED' | 'UPLOADING';
export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type UserRole = 'Admin' | 'Data Engineer' | 'ML Engineer' | 'Viewer';

export interface Dataset {
    id: string;
    name: string;
    description: string;
    type: DatasetType;
    sizeBytes: number;
    sizeFormatted: string;
    fileCount: number;
    recordCount: number;
    latestVersion: string;
    status: DatasetStatus;
    updatedAt: string;
    createdAt: string;
    owner: string;
    ownerAvatar?: string;
    tags: string[];
    license: string;
    language?: string;
    domain?: string;
    classesCount?: number;
    qualityScore: number; // e.g. 96.7
    storageLocation: string;
}

export interface DatasetVersion {
    version: string; // 'v1', 'v2', 'v3'
    createdAt: string;
    sizeFormatted: string;
    fileCount: number;
    recordCount: number;
    duplicateCount: number;
    qualityScore: number;
    changesDescription: string;
    isCurrent?: boolean;
}

export interface DatasetFile {
    id: string;
    name: string;
    path: string;
    sizeFormatted: string;
    format: string;
    status: 'VALID' | 'CORRUPTED' | 'DUPLICATE';
    updatedAt: string;
}

export interface DatasetValidationReport {
    datasetId: string;
    datasetName: string;
    qualityScore: number;
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalRecords: number;
    duplicateRecords: number;
    missingValues: number;
    corruptedFiles: number;
    schemaValid: boolean;
    issues: {
        id: string;
        severity: 'HIGH' | 'MEDIUM' | 'LOW';
        category: 'Duplicates' | 'Corrupted' | 'Missing Schema' | 'Outliers';
        description: string;
        affectedCount: number;
    }[];
}

export interface ProcessingJob {
    id: string;
    datasetId: string;
    datasetName: string;
    operation: string; // e.g. "Deduplication & Parquet Conversion"
    status: JobStatus;
    progressPercent: number;
    startedAt: string;
    durationFormatted: string;
    initiatedBy: string;
    logs: string[];
    error?: string;
}

export interface StorageMetrics {
    totalBytes: number;
    usedBytes: number;
    availableBytes: number;
    usedPercentage: number;
    objectCount: number;
    storageByDatasetType: { type: DatasetType; bytes: number; percentage: number }[];
    storageByFileType: { extension: string; bytes: number; percentage: number }[];
    usageTrend: { date: string; usedTB: number }[];
}

export interface AITrainingJob {
    id: string;
    modelName: string;
    datasetId: string;
    datasetName: string;
    datasetVersion: string;
    framework: 'PyTorch' | 'TensorFlow' | 'JAX';
    epochs: number;
    batchSize: number;
    learningRate: number;
    hardware: '8x NVIDIA H100 GPU' | '4x NVIDIA A100 GPU' | 'CPU Cluster';
    status: JobStatus;
    accuracyPercent?: number;
    startedAt: string;
    duration: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE' | 'Active' | 'Inactive';
    datasetsOwnedCount?: number;
    lastActive: string;
    createdAt?: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    userName?: string;
    userEmail?: string;
    action: string;
    resource: string;
    ipAddress: string;
    status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
}
