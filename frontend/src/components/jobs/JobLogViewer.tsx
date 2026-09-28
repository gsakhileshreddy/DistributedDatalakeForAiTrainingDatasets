import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Copy,
    Download,
    Search,
    Check,
    Play,
    Pause,
    RefreshCw,
    X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/ToastContext';
import { ProcessingJob } from '../../types';

export interface JobLogViewerProps {
    job: ProcessingJob | null;
    isOpen: boolean;
    onClose: () => void;
}

export const JobLogViewer: React.FC<JobLogViewerProps> = ({ job, isOpen, onClose }) => {
    const [logQuery, setLogQuery] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [copied, setCopied] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (autoScroll && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [job?.logs, autoScroll]);

    if (!job) return null;

    const filteredLogs = job.logs.filter((line) =>
        line.toLowerCase().includes(logQuery.toLowerCase())
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(job.logs.join('\n'));
        setCopied(true);
        toast('info', 'Logs Copied', 'Terminal execution logs copied to clipboard.');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([job.logs.join('\n')], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${job.id}-logs.log`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast('success', 'Logs Downloaded', `${job.id}-logs.log saved to computer.`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="space-y-4">
                {/* Terminal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-foreground tracking-tight">{job.operation}</h3>
                                <span className="text-xs font-mono text-muted-foreground">({job.id})</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dataset: <b>{job.datasetName}</b> • Initiated by {job.initiatedBy}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload} leftIcon={<Download className="w-3.5 h-3.5" />}>
                            Download Logs
                        </Button>
                    </div>
                </div>

                {/* Log Controls Filter Bar */}
                <div className="flex items-center justify-between gap-3 bg-muted/40 p-2 rounded-lg border border-border text-xs">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={logQuery}
                            onChange={(e) => setLogQuery(e.target.value)}
                            placeholder="Search terminal logs (e.g. INFO, ERROR, Spark)..."
                            className="w-full pl-8 pr-3 py-1 rounded border border-border bg-background text-foreground text-xs focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[11px] transition-colors ${autoScroll ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-background border-border text-muted-foreground'
                            }`}
                    >
                        {autoScroll ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />} Auto-Scroll
                    </button>
                </div>

                {/* Black Terminal Screen */}
                <div
                    ref={logContainerRef}
                    className="terminal-window p-4 rounded-xl border border-slate-800 h-80 overflow-y-auto space-y-1.5 font-mono text-xs shadow-2xl"
                >
                    {filteredLogs.map((line, idx) => {
                        const isError = line.includes('ERROR') || line.includes('FATAL');
                        const isSuccess = line.includes('SUCCESS');
                        const isInfo = line.includes('INFO');

                        return (
                            <div
                                key={idx}
                                className={`leading-relaxed whitespace-pre-wrap ${isError ? 'text-rose-400 font-semibold' : isSuccess ? 'text-emerald-400 font-semibold' : isInfo ? 'text-sky-300' : 'text-slate-300'
                                    }`}
                            >
                                {line}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
