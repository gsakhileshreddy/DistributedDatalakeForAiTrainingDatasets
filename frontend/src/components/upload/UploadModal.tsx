import React, { useState, useEffect } from 'react';
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    AlertCircle,
    Pause,
    Play,
    RotateCcw,
    X,
    FileCheck,
    ShieldCheck,
    Zap,
    ArrowRight,
    Database
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/ToastContext';
import { DatasetType } from '../../types';

export interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Details form state
    const [name, setName] = useState('Customer Image Classification v4');
    const [description, setDescription] = useState('Updated 2026 Q3 retail store imagery with bounding box annotations.');
    const [type, setType] = useState<DatasetType>('IMAGE');
    const [license, setLicense] = useState('Apache-2.0');

    // Upload simulation state
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState('1.2 GB/s');
    const [eta, setEta] = useState('2 min 14 sec');

    const { toast } = useToast();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 4 && !isPaused && progress < 100) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 98) {
                        clearInterval(timer);
                        setStep(5);
                        toast('success', 'Dataset uploaded successfully', 'Version v4 is now ready for validation and training.');
                        return 100;
                    }
                    const next = prev + 4;
                    const remainingSec = Math.max(0, Math.round(((100 - next) / 4) * 2));
                    setEta(`${remainingSec} sec`);
                    return next;
                });
            }, 300);
        }
        return () => clearInterval(timer);
    }, [step, isPaused, progress, toast]);

    const handleReset = () => {
        setStep(1);
        setSelectedFile(null);
        setProgress(0);
        setIsPaused(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
            setName(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ''));
        }
    };

    const stepsList = [
        { num: 1, label: 'Select Files' },
        { num: 2, label: 'Details' },
        { num: 3, label: 'Validate' },
        { num: 4, label: 'Upload' },
        { num: 5, label: 'Complete' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="3xl">
            <div className="space-y-6">
                {/* Wizard Header & Step Indicator */}
                <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">Upload Dataset</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Ingest, validate, and index distributed AI training datasets into the data lake.
                    </p>

                    <div className="grid grid-cols-5 gap-2 mt-5">
                        {stepsList.map((s) => {
                            const isCurrent = step === s.num;
                            const isCompleted = step > s.num;
                            return (
                                <div key={s.num} className="flex flex-col gap-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-colors ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                    <span className={`text-[11px] font-medium transition-colors ${isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                                        {s.num}. {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 1: Select Files Drag & Drop */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                    ? 'border-primary bg-primary/10'
                                    : selectedFile
                                        ? 'border-emerald-500/40 bg-emerald-500/5'
                                        : 'border-border hover:border-primary/40 bg-card'
                                }`}
                        >
                            <div className="p-4 rounded-full bg-primary/10 text-primary inline-flex mb-3">
                                <UploadCloud className="w-8 h-8" />
                            </div>

                            {selectedFile ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
                                        <FileCheck className="w-5 h-5" />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for metadata configuration
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        Drop your dataset here or{' '}
                                        <label className="text-primary hover:underline cursor-pointer">
                                            browse files
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setSelectedFile(e.target.files[0]);
                                                        setName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        Supported formats: CSV · JSON · JSONL · Parquet · ZIP · Images · TXT
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-muted-foreground border-t border-border/50 pt-4">
                                <span>Max Single File Size: <b>5 TB</b></span>
                                <span>•</span>
                                <span>Chunked Parallel Stream Enabled</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                disabled={!selectedFile}
                                onClick={() => setStep(2)}
                                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            >
                                Next: Dataset Details
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Dataset Details */}
                {step === 2 && (
                    <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-foreground block mb-1">Dataset Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">Dataset Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as DatasetType)}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="IMAGE">IMAGE (Computer Vision)</option>
                                    <option value="TEXT">TEXT (NLP / LLM Tokens)</option>
                                    <option value="AUDIO">AUDIO (Acoustic Telemetry)</option>
                                    <option value="VIDEO">VIDEO (Spatial RGB-D Feeds)</option>
                                    <option value="TABULAR">TABULAR (Time-series / Parquet)</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="font-semibold text-foreground block mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">License</label>
                                <input
                                    type="text"
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">Storage Bucket Target</label>
                                <input
                                    type="text"
                                    value="s3://datalake-ai-us-east-1/customer-images/"
                                    disabled
                                    className="w-full px-3 py-2 rounded-md border border-border bg-muted text-muted-foreground font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 pt-4">
                            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button size="sm" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                                Next: Run Automated Validation
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Automated Pre-Validation */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg bg-card space-y-3">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Pre-Upload Integrity Scan Passed</h4>
                                    <p className="text-xs text-muted-foreground">Checksum verification & schema compatibility check complete.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                                <div className="p-2.5 bg-muted/40 rounded border border-border">
                                    <span className="text-muted-foreground block text-[10px]">PARQUET SCHEMA</span>
                                    <span className="font-semibold text-emerald-400">Compatible</span>
                                </div>
                                <div className="p-2.5 bg-muted/40 rounded border border-border">
                                    <span className="text-muted-foreground block text-[10px]">CORRUPTION RISK</span>
                                    <span className="font-semibold text-emerald-400">0.00% Clean</span>
                                </div>
                                <div className="p-2.5 bg-muted/40 rounded border border-border">
                                    <span className="text-muted-foreground block text-[10px]">DEDUPLICATION SCAN</span>
                                    <span className="font-semibold text-sky-400">Scheduled in Pipeline</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                                Back
                            </Button>
                            <Button size="sm" onClick={() => setStep(4)} leftIcon={<Zap className="w-3.5 h-3.5" />}>
                                Start Ingestion Upload
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Uploading In Progress */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm text-foreground">Uploading dataset...</h4>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedFile?.name || 'customer_images.zip'}</p>
                                </div>
                                <span className="text-xs font-mono font-semibold text-primary">{progress}%</span>
                            </div>

                            {/* Upload Progress Bar */}
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-300 shadow-glow"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-xs font-mono text-muted-foreground pt-1">
                                <div>
                                    <span className="text-[10px] block uppercase">Transferred</span>
                                    <span className="text-foreground font-semibold">{(742 * (progress / 100)).toFixed(0)} GB / 742 GB</span>
                                </div>
                                <div>
                                    <span className="text-[10px] block uppercase">Speed</span>
                                    <span className="text-emerald-400 font-semibold">{speed}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] block uppercase">Estimated Time</span>
                                    <span className="text-foreground font-semibold">{eta}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPaused(!isPaused)}
                                leftIcon={isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                            >
                                {isPaused ? 'Resume' : 'Pause'}
                            </Button>

                            <div className="flex gap-2">
                                <Button variant="danger" size="sm" onClick={handleReset}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: Complete */}
                {step === 5 && (
                    <div className="text-center py-6 space-y-4">
                        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 inline-flex">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Upload & Ingestion Complete!</h3>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                                <b>{name}</b> (v4) has been stored in S3 object lake and sent to the Spark processing queue.
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-4">
                            <Button variant="outline" size="sm" onClick={handleClose}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleClose} leftIcon={<Database className="w-3.5 h-3.5" />}>
                                View Dataset
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
