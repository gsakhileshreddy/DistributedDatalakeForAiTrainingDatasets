import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GitBranch,
    ArrowLeftRight,
    Download,
    RotateCcw,
    CheckCircle2,
    Layers,
    ArrowRight,
    FileCode
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { mockVersions } from '../services/api';

export const DatasetVersions: React.FC = () => {
    const [selectedV1, setSelectedV1] = useState('v2');
    const [selectedV2, setSelectedV2] = useState('v3');
    const navigate = useNavigate();

    const comparisonMetrics = [
        { label: 'Files Count', v2: '2.2M', v3: '2.4M', diff: '+200,000 files (+9.0%)', isPositive: true },
        { label: 'Total Size', v2: '810 GB', v3: '842 GB', diff: '+32 GB (+3.9%)', isPositive: true },
        { label: 'Total Records', v2: '4.2M', v3: '4.6M', diff: '+400,000 records', isPositive: true },
        { label: 'Duplicate Records', v2: '15,200', v3: '12,430', diff: '-2,770 duplicates (-18.2%)', isPositive: true },
        { label: 'Quality Score', v2: '94.2%', v3: '96.7%', diff: '+2.5% quality boost', isPositive: true },
        { label: 'Schema Version', v2: 'v2.1 Parquet', v3: 'v2.2 Parquet', diff: '+1 Metadata column', isPositive: true },
    ];

    return (
        <div className="space-y-6">
            {/* Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Dataset Version Control & Lineage</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Compare snapshots, review lineage diffs, and restore historical dataset versions.
                    </p>
                </div>
            </div>

            {/* Version Timeline & Comparison Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Version Timeline */}
                <Card className="lg:col-span-1 space-y-4">
                    <CardHeader>
                        <div>
                            <CardTitle>Version History</CardTitle>
                            <CardDescription>Immutable data snapshots</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {mockVersions.map((v) => (
                            <div
                                key={v.version}
                                className="p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/40 transition-all space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-sm text-foreground">{v.version}</span>
                                        {v.isCurrent && (
                                            <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">
                                                CURRENT
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{v.createdAt}</span>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed">{v.changesDescription}</p>

                                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/50">
                                    <div>Size: <b className="text-foreground">{v.sizeFormatted}</b></div>
                                    <div>Files: <b className="text-foreground">{v.fileCount.toLocaleString()}</b></div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="w-full text-[11px]">
                                        Restore {v.version}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Side-by-Side Comparison Table */}
                <Card className="lg:col-span-2 space-y-4">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <CardTitle>Version Comparison Matrix</CardTitle>
                                <CardDescription>Side-by-side metric and schema difference view</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedV1}
                                    onChange={(e) => setSelectedV1(e.target.value)}
                                    className="px-2 py-1 text-xs rounded border border-border bg-background font-mono font-semibold"
                                >
                                    <option value="v1">v1</option>
                                    <option value="v2">v2</option>
                                </select>
                                <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                                <select
                                    value={selectedV2}
                                    onChange={(e) => setSelectedV2(e.target.value)}
                                    className="px-2 py-1 text-xs rounded border border-border bg-background font-mono font-semibold"
                                >
                                    <option value="v2">v2</option>
                                    <option value="v3">v3</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Metric / Property</th>
                                    <th className="py-3 px-4 font-mono font-bold text-foreground text-center">{selectedV1}</th>
                                    <th className="py-3 px-4 font-mono font-bold text-primary text-center">{selectedV2}</th>
                                    <th className="py-3 px-4 text-right">Delta Highlight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 font-medium">
                                {comparisonMetrics.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-muted/30">
                                        <td className="py-3 px-4 font-semibold text-foreground">{row.label}</td>
                                        <td className="py-3 px-4 font-mono text-muted-foreground text-center">{row.v2}</td>
                                        <td className="py-3 px-4 font-mono text-foreground font-bold text-center">{row.v3}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                {row.diff}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
