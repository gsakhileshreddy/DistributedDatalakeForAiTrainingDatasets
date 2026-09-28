import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    FileCheck,
    Copy,
    Layers,
    Sparkles,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { mockValidationReport } from '../services/api';

export const DatasetValidation: React.FC = () => {
    const report = mockValidationReport;
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Top Quality Header Banner */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-foreground tracking-tight">Dataset Validation Report</h1>
                            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                {report.qualityScore}% Quality
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Automated validation scan for <b>{report.datasetName}</b> (v3)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/jobs')} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                        Re-run Validation Pipeline
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/datasets/${report.datasetId}`)} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Back to Dataset
                    </Button>
                </div>
            </div>

            {/* KPI Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-muted-foreground font-semibold text-[10px] uppercase">Valid Files</div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">{report.validFiles}</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">out of {report.totalFiles} total</span>
                </Card>

                <Card className="border-rose-500/30 bg-rose-500/5">
                    <div className="text-muted-foreground font-semibold text-[10px] uppercase">Invalid Files</div>
                    <div className="text-2xl font-bold text-rose-400 font-mono mt-2">{report.invalidFiles}</div>
                    <span className="text-[10px] text-rose-400/80 mt-1 block">Header check failed</span>
                </Card>

                <Card>
                    <div className="text-muted-foreground font-semibold text-[10px] uppercase">Duplicate Records</div>
                    <div className="text-2xl font-bold text-amber-400 font-mono mt-2">{report.duplicateRecords.toLocaleString()}</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">0.51% of records</span>
                </Card>

                <Card>
                    <div className="text-muted-foreground font-semibold text-[10px] uppercase">Missing Values</div>
                    <div className="text-2xl font-bold text-sky-400 font-mono mt-2">{report.missingValues.toLocaleString()}</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Non-critical metadata</span>
                </Card>

                <Card>
                    <div className="text-muted-foreground font-semibold text-[10px] uppercase">Corrupted Files</div>
                    <div className="text-2xl font-bold text-rose-500 font-mono mt-2">{report.corruptedFiles}</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Truncated frames</span>
                </Card>
            </div>

            {/* Quality Sections & Issues List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Issues List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div>
                            <CardTitle>Detected Validation Issues</CardTitle>
                            <CardDescription>Categorized by anomaly detection algorithms</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {report.issues.map((iss) => (
                            <div key={iss.id} className="p-4 rounded-lg border border-border bg-muted/30 text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${iss.severity === 'HIGH'
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                : iss.severity === 'MEDIUM'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}
                                        >
                                            {iss.severity} SEVERITY
                                        </span>
                                        <span className="font-bold text-foreground">{iss.category}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        {iss.affectedCount.toLocaleString()} items affected
                                    </span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{iss.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Validation Category Scores */}
                <Card className="space-y-4">
                    <CardHeader>
                        <CardTitle>Category Scores</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-xs">
                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span className="text-foreground">File Format Checksum</span>
                                <span className="text-emerald-400 font-mono">97.3%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '97.3%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span className="text-foreground">Schema Compatibility</span>
                                <span className="text-emerald-400 font-mono">100.0%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span className="text-foreground">Deduplication Integrity</span>
                                <span className="text-amber-400 font-mono">94.8%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: '94.8%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between font-semibold mb-1">
                                <span className="text-foreground">Missing Data Rate</span>
                                <span className="text-emerald-400 font-mono">99.8%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99.8%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
