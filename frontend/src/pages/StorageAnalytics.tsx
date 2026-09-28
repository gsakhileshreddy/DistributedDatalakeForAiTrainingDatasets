import React, { useState, useEffect } from 'react';
import {
    HardDrive,
    Database,
    Layers,
    FileCode,
    TrendingUp,
    PieChart as PieIcon,
    ArrowUpRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { api } from '../services/api';
import { StorageMetrics } from '../types';

export const StorageAnalytics: React.FC = () => {
    const [metrics, setMetrics] = useState<StorageMetrics | null>(null);

    useEffect(() => {
        const fetchStorage = async () => {
            const data = await api.getStorageMetrics();
            setMetrics(data);
        };
        fetchStorage();
    }, []);

    if (!metrics) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Storage Analytics & Distribution</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Monitor distributed S3 / MinIO object storage utilization and volume growth across regions.
                    </p>
                </div>
            </div>

            {/* Main Storage Utilization Indicator Bar */}
            <Card className="bg-card border border-border p-6 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-foreground">S3 Object Lake Capacity</h3>
                            <p className="text-xs text-muted-foreground">s3://datalake-ai-production-cluster/</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-2xl font-extrabold text-foreground font-mono">2.84 TB</span>
                        <span className="text-xs text-muted-foreground block">/ 3.50 TB Allocated</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-semibold">
                        <span className="text-primary">82% Capacity Used</span>
                        <span className="text-emerald-400">620 GB Available</span>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 shadow-glow"
                            style={{ width: '82%' }}
                        />
                    </div>
                </div>
            </Card>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Total Capacity</span>
                    <div className="text-2xl font-bold text-foreground font-mono mt-2">3.50 TB</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Provisioned AWS S3</span>
                </Card>

                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Used Volume</span>
                    <div className="text-2xl font-bold text-purple-400 font-mono mt-2">2.84 TB</div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">+8.2% vs last month</span>
                </Card>

                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Available Volume</span>
                    <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">620 GB</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Unallocated S3 storage</span>
                </Card>

                <Card>
                    <span className="text-muted-foreground font-semibold text-[10px] uppercase">Total Object Count</span>
                    <div className="text-2xl font-bold text-sky-400 font-mono mt-2">4,850,200</div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">Files & Parquet chunks</span>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Storage Growth Over Time */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Storage Volume Growth</CardTitle>
                            <CardDescription>Daily object lake size (TB)</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="h-64 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics.usageTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit=" TB" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="usedTB" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Storage by File Extension */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Storage by File Format</CardTitle>
                            <CardDescription>Parquet, JSONL, JPG, MP4 distribution</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2 text-xs">
                        {metrics.storageByFileType.map((item) => (
                            <div key={item.extension} className="space-y-1">
                                <div className="flex justify-between font-semibold">
                                    <span className="font-mono text-foreground">{item.extension}</span>
                                    <span className="text-muted-foreground font-mono">{item.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};
