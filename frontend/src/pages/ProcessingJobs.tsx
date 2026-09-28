import React, { useState, useEffect } from 'react';
import {
    Cpu,
    Search,
    Filter,
    Terminal,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Clock,
    MoreVertical,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { JobLogViewer } from '../components/jobs/JobLogViewer';
import { useToast } from '../components/ui/ToastContext';
import { api } from '../services/api';
import { ProcessingJob } from '../types';

export const ProcessingJobs: React.FC = () => {
    const [jobs, setJobs] = useState<ProcessingJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchJobs = async () => {
            const data = await api.getJobs();
            setJobs(data);
        };
        fetchJobs();
    }, []);

    const handleOpenLogs = (job: ProcessingJob) => {
        setSelectedJob(job);
        setIsLogOpen(true);
    };

    const handleCancelJob = (id: string) => {
        setJobs((prev) =>
            prev.map((j) => (j.id === id ? { ...j, status: 'FAILED', progressPercent: j.progressPercent } : j))
        );
        toast('warning', 'Job Cancelled', `Processing Job ${id} was terminated by user.`);
    };

    const filteredJobs = jobs.filter((j) =>
        j.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.datasetName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Processing Jobs Monitoring</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Distributed Spark deduplication, Parquet conversion, and BPE tokenizer ingestion pipelines.
                    </p>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-subtle">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search job ID, operation, or target dataset..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Enterprise Job Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Job ID</th>
                                <th className="py-3 px-4">Operation</th>
                                <th className="py-3 px-3">Dataset</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-4 w-48">Progress</th>
                                <th className="py-3 px-3">Started</th>
                                <th className="py-3 px-3">Duration</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {filteredJobs.map((j) => (
                                <tr key={j.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{j.id}</td>
                                    <td className="py-3.5 px-4 font-semibold text-foreground">{j.operation}</td>
                                    <td className="py-3.5 px-3 text-muted-foreground">{j.datasetName}</td>
                                    <td className="py-3.5 px-3">
                                        <StatusBadge status={j.status} />
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-mono">
                                                <span className="text-muted-foreground">Execution</span>
                                                <span className="font-semibold text-foreground">{j.progressPercent}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${j.status === 'FAILED' ? 'bg-rose-500' : j.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-primary animate-pulse'
                                                        }`}
                                                    style={{ width: `${j.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 text-muted-foreground">{j.startedAt}</td>
                                    <td className="py-3.5 px-3 font-mono text-muted-foreground">{j.durationFormatted}</td>
                                    <td className="py-3.5 px-4 text-right space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenLogs(j)}
                                            leftIcon={<Terminal className="w-3.5 h-3.5" />}
                                        >
                                            Logs
                                        </Button>
                                        {j.status === 'RUNNING' && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleCancelJob(j.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Terminal Log Modal Viewer */}
            <JobLogViewer
                job={selectedJob}
                isOpen={isLogOpen}
                onClose={() => setIsLogOpen(false)}
            />
        </div>
    );
};
