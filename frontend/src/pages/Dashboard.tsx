import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Database,
    HardDrive,
    FileCode,
    Cpu,
    TrendingUp,
    Upload,
    MoreVertical,
    ArrowUpRight,
    RefreshCcw,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { UploadModal } from '../components/upload/UploadModal';
import { api } from '../services/api';
import { Dataset, StorageMetrics } from '../types';

export const Dashboard: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const dsData = await api.getDatasets();
            const stData = await api.getStorageMetrics();
            setDatasets(dsData);
            setMetrics(stData);
        };
        fetchData();
    }, []);

    // Recharts Chart Mock Datasets
    const storageUsageData = [
        { date: 'Aug 01', storageTB: 2.10, growth: 12 },
        { date: 'Aug 05', storageTB: 2.22, growth: 15 },
        { date: 'Aug 10', storageTB: 2.38, growth: 18 },
        { date: 'Aug 15', storageTB: 2.45, growth: 22 },
        { date: 'Aug 20', storageTB: 2.61, growth: 28 },
        { date: 'Aug 25', storageTB: 2.74, growth: 31 },
        { date: 'Aug 31', storageTB: 2.84, growth: 35 },
    ];

    const datasetTypePie = [
        { name: 'Images', value: 35, color: '#a855f7' },
        { name: 'Text / LLM', value: 40, color: '#3b82f6' },
        { name: 'Audio', value: 12, color: '#f59e0b' },
        { name: 'Video', value: 8, color: '#f43f5e' },
        { name: 'Tabular', value: 5, color: '#10b981' },
    ];

    const jobsBarData = [
        { name: 'Mon', completed: 42, running: 4, failed: 1 },
        { name: 'Tue', completed: 58, running: 6, failed: 2 },
        { name: 'Wed', completed: 65, running: 8, failed: 0 },
        { name: 'Thu', completed: 48, running: 5, failed: 1 },
        { name: 'Fri', completed: 72, running: 10, failed: 3 },
        { name: 'Sat', completed: 30, running: 2, failed: 0 },
        { name: 'Sun', completed: 27, running: 1, failed: 0 },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Good morning, Alex</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Monitor your AI data infrastructure, processing pipelines, and training datasets.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsUploadOpen(true)}
                        leftIcon={<Upload className="w-4 h-4" />}
                    >
                        Upload Dataset
                    </Button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1 */}
                <Card hoverable onClick={() => navigate('/datasets')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Total Datasets</span>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Database className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-foreground">128</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="font-medium">+12.5%</span>
                            <span className="text-muted-foreground text-[10px]">vs last month</span>
                        </div>
                    </div>
                </Card>

                {/* KPI 2 */}
                <Card hoverable onClick={() => navigate('/storage')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Total Storage</span>
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <HardDrive className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-foreground">2.84 TB</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="font-medium">+8.2%</span>
                            <span className="text-muted-foreground text-[10px]">vs last month</span>
                        </div>
                    </div>
                </Card>

                {/* KPI 3 */}
                <Card hoverable onClick={() => navigate('/datasets')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Training Files</span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <FileCode className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-foreground">4.8M</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="font-medium">+15.4%</span>
                            <span className="text-muted-foreground text-[10px]">vs last month</span>
                        </div>
                    </div>
                </Card>

                {/* KPI 4 */}
                <Card hoverable onClick={() => navigate('/jobs')}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Processing Jobs</span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Cpu className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-foreground">342</div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="font-medium">96.8%</span>
                            <span className="text-muted-foreground text-[10px]">success rate</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Analytics Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart: Storage Usage Growth */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div>
                            <CardTitle>Storage Usage & Growth</CardTitle>
                            <CardDescription>Historical data lake volume over time (TB)</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-xs">
                            {(['7d', '30d', '90d'] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setTimeRange(r)}
                                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${timeRange === r ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="h-72 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={storageUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="storageColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} unit=" TB" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="storageTB" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#storageColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Donut Chart: Dataset Types */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Dataset Modalities</CardTitle>
                            <CardDescription>Breakdown by data format</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="h-72 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="70%">
                            <PieChart>
                                <Pie
                                    data={datasetTypePie}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {datasetTypePie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-2 gap-2 text-xs w-full pt-2">
                            {datasetTypePie.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground truncate">{item.name}</span>
                                    <span className="font-semibold text-foreground ml-auto">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Processing Jobs Bar Chart & Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <div>
                            <CardTitle>Jobs Activity</CardTitle>
                            <CardDescription>Daily Spark job execution</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="h-64 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobsBarData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="running" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="failed" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Datasets Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div>
                            <CardTitle>Recent Datasets</CardTitle>
                            <CardDescription>Active datasets in production data lake</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/datasets')}>
                            View All
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Dataset</th>
                                    <th className="py-3 px-3">Type</th>
                                    <th className="py-3 px-3">Size</th>
                                    <th className="py-3 px-3">Version</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">Updated</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 font-medium">
                                {datasets.map((ds) => (
                                    <tr
                                        key={ds.id}
                                        onClick={() => navigate(`/datasets/${ds.id}`)}
                                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-4 font-semibold text-foreground">
                                            {ds.name}
                                            <span className="block text-[10px] text-muted-foreground font-normal">{ds.owner}</span>
                                        </td>
                                        <td className="py-3 px-3"><TypeBadge type={ds.type} /></td>
                                        <td className="py-3 px-3 text-muted-foreground font-mono">{ds.sizeFormatted}</td>
                                        <td className="py-3 px-3 font-mono font-semibold text-primary">{ds.latestVersion}</td>
                                        <td className="py-3 px-3"><StatusBadge status={ds.status} /></td>
                                        <td className="py-3 px-3 text-muted-foreground">{ds.updatedAt}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/datasets/${ds.id}`);
                                                }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Upload Dataset Modal */}
            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};
