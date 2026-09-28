import React, { useState, useEffect } from 'react';
import {
    BrainCircuit,
    Cpu,
    Database,
    Plus,
    Play,
    CheckCircle2,
    Clock,
    Sparkles,
    ArrowRight,
    Sliders,
    Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/ToastContext';
import { api, mockDatasets } from '../services/api';
import { AITrainingJob } from '../types';

export const AITraining: React.FC = () => {
    const [jobs, setJobs] = useState<AITrainingJob[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

    // Training Job Form State
    const [modelName, setModelName] = useState('ResNet-152-Retail-Backbone');
    const [selectedDatasetId, setSelectedDatasetId] = useState('ds-1');
    const [selectedVersion, setSelectedVersion] = useState('v3');
    const [framework, setFramework] = useState<'PyTorch' | 'TensorFlow' | 'JAX'>('PyTorch');
    const [epochs, setEpochs] = useState(50);
    const [batchSize, setBatchSize] = useState(128);
    const [learningRate, setLearningRate] = useState(0.001);
    const [hardware, setHardware] = useState<'8x NVIDIA H100 GPU' | '4x NVIDIA A100 GPU' | 'CPU Cluster'>('8x NVIDIA H100 GPU');

    const { toast } = useToast();

    useEffect(() => {
        const fetchTraining = async () => {
            const data = await api.getTrainingJobs();
            setJobs(data);
        };
        fetchTraining();
    }, []);

    const handleStartTraining = () => {
        const newJob: AITrainingJob = {
            id: `train-${Math.floor(Math.random() * 900 + 100)}`,
            modelName,
            datasetId: selectedDatasetId,
            datasetName: mockDatasets.find((d) => d.id === selectedDatasetId)?.name || 'Customer Images',
            datasetVersion: selectedVersion,
            framework,
            epochs,
            batchSize,
            learningRate,
            hardware,
            status: 'RUNNING',
            startedAt: 'Just now',
            duration: '0m 05s',
        };

        setJobs([newJob, ...jobs]);
        setIsWizardOpen(false);
        setWizardStep(1);
        toast('success', 'Training Job Launched', `${modelName} launched on ${hardware}.`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Model Training Workflows</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Launch PyTorch, TensorFlow, and JAX model pre-training jobs directly from data lake partitions.
                    </p>
                </div>
                <Button
                    onClick={() => setIsWizardOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    Create Training Job
                </Button>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <Card className="border-sky-500/30 bg-sky-500/5">
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Active Models Training</span>
                    <div className="text-2xl font-bold text-sky-400 font-mono mt-2">1 Running</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">8x NVIDIA H100 GPUs active</span>
                </Card>

                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Ready Training Datasets</span>
                    <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">4 Datasets</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Passed schema & quality validation</span>
                </Card>

                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Mean Model Accuracy</span>
                    <div className="text-2xl font-bold text-foreground font-mono mt-2">95.1%</div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">+2.1% accuracy gain with v3 datasets</span>
                </Card>
            </div>

            {/* Recent Training Jobs Table */}
            <Card className="p-0 overflow-hidden">
                <CardHeader className="p-4 border-b border-border">
                    <CardTitle>Recent Training Jobs</CardTitle>
                    <CardDescription>Execution history across GPU clusters</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Model Name</th>
                                <th className="py-3 px-3">Dataset & Version</th>
                                <th className="py-3 px-3">Framework</th>
                                <th className="py-3 px-3">Hyperparameters</th>
                                <th className="py-3 px-3">Hardware Target</th>
                                <th className="py-3 px-3">Accuracy %</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-4 text-right">Started</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {jobs.map((j) => (
                                <tr key={j.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-primary shrink-0" />
                                        {j.modelName}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <span className="font-semibold text-foreground">{j.datasetName}</span>
                                        <span className="text-[10px] font-mono text-primary ml-1.5 font-bold">({j.datasetVersion})</span>
                                    </td>
                                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground">{j.framework}</td>
                                    <td className="py-3.5 px-3 text-muted-foreground font-mono text-[11px]">
                                        {j.epochs} ep • bs={j.batchSize} • lr={j.learningRate}
                                    </td>
                                    <td className="py-3.5 px-3 font-mono text-xs">{j.hardware}</td>
                                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                                        {j.accuracyPercent ? `${j.accuracyPercent}%` : 'Evaluating...'}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <StatusBadge status={j.status} />
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-muted-foreground">{j.startedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* CREATE TRAINING JOB WIZARD MODAL */}
            <Modal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} maxWidth="2xl">
                <div className="space-y-5">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Create AI Model Training Job</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Select dataset, specify version, and configure model training hyperparameters.
                        </p>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {[
                                { n: 1, l: 'Select Dataset' },
                                { n: 2, l: 'Version & Framework' },
                                { n: 3, l: 'Hyperparameters' },
                                { n: 4, l: 'Launch' },
                            ].map((s) => (
                                <div key={s.n} className="space-y-1">
                                    <div
                                        className={`h-1.5 rounded-full ${wizardStep >= s.n ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                    <span className={`text-[10px] block ${wizardStep === s.n ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                        {s.n}. {s.l}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STEP 1: Select Dataset */}
                    {wizardStep === 1 && (
                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="font-semibold text-foreground block mb-1">Model Name</label>
                                <input
                                    type="text"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">Target Training Dataset</label>
                                <select
                                    value={selectedDatasetId}
                                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                                >
                                    {mockDatasets.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name} ({d.type} • {d.sizeFormatted})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end pt-3">
                                <Button size="sm" onClick={() => setWizardStep(2)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                                    Next: Framework & Version
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Framework & Version */}
                    {wizardStep === 2 && (
                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="font-semibold text-foreground block mb-1">Dataset Version Snapshot</label>
                                <select
                                    value={selectedVersion}
                                    onChange={(e) => setSelectedVersion(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                >
                                    <option value="v3">v3 (Current - 842 GB - 96.7% Quality)</option>
                                    <option value="v2">v2 (810 GB)</option>
                                    <option value="v1">v1 (650 GB)</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">Deep Learning Framework</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['PyTorch', 'TensorFlow', 'JAX'] as const).map((fw) => (
                                        <button
                                            key={fw}
                                            type="button"
                                            onClick={() => setFramework(fw)}
                                            className={`p-3 rounded-lg border text-center font-bold transition-all ${framework === fw
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border bg-background hover:bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {fw}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between pt-3">
                                <Button variant="outline" size="sm" onClick={() => setWizardStep(1)}>Back</Button>
                                <Button size="sm" onClick={() => setWizardStep(3)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                                    Next: Hyperparameters
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Hyperparameters & Hardware */}
                    {wizardStep === 3 && (
                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">Epochs</label>
                                    <input
                                        type="number"
                                        value={epochs}
                                        onChange={(e) => setEpochs(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded border border-border bg-background font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">Batch Size</label>
                                    <select
                                        value={batchSize}
                                        onChange={(e) => setBatchSize(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded border border-border bg-background font-mono"
                                    >
                                        <option value={32}>32</option>
                                        <option value={64}>64</option>
                                        <option value={128}>128</option>
                                        <option value={256}>256</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">Learning Rate</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={learningRate}
                                        onChange={(e) => setLearningRate(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded border border-border bg-background font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-foreground block mb-1">Target Compute Hardware Cluster</label>
                                <select
                                    value={hardware}
                                    onChange={(e) => setHardware(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                >
                                    <option value="8x NVIDIA H100 GPU">8x NVIDIA H100 GPU (80GB SXM5)</option>
                                    <option value="4x NVIDIA A100 GPU">4x NVIDIA A100 GPU (40GB PCIe)</option>
                                    <option value="CPU Cluster">CPU Distributed Worker Cluster</option>
                                </select>
                            </div>

                            <div className="flex justify-between pt-3">
                                <Button variant="outline" size="sm" onClick={() => setWizardStep(2)}>Back</Button>
                                <Button size="sm" onClick={() => setWizardStep(4)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                                    Next: Review Configuration
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Review & Launch */}
                    {wizardStep === 4 && (
                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                                <h4 className="font-bold text-sm text-foreground">{modelName}</h4>
                                <div className="grid grid-cols-2 gap-2 text-muted-foreground font-mono pt-2 border-t border-border/50">
                                    <div>Dataset: <b>{mockDatasets.find(d => d.id === selectedDatasetId)?.name} ({selectedVersion})</b></div>
                                    <div>Framework: <b>{framework}</b></div>
                                    <div>Epochs: <b>{epochs}</b></div>
                                    <div>Batch Size: <b>{batchSize}</b></div>
                                    <div>Learning Rate: <b>{learningRate}</b></div>
                                    <div>Hardware: <b>{hardware}</b></div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2">
                                <Button variant="outline" size="sm" onClick={() => setWizardStep(3)}>Back</Button>
                                <Button size="sm" onClick={handleStartTraining} leftIcon={<Play className="w-3.5 h-3.5" />}>
                                    Start Training Job
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
