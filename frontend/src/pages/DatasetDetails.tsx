import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Database,
    Download,
    ShieldCheck,
    GitBranch,
    Edit3,
    Save,
    X,
    FileCode,
    Layers,
    Clock,
    UserCheck,
    Tag,
    CheckCircle2,
    HardDrive,
    Copy,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { useToast } from '../components/ui/ToastContext';
import { api, mockVersions, mockValidationReport } from '../services/api';
import { Dataset } from '../types';

export const DatasetDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [dataset, setDataset] = useState<Dataset | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'versions' | 'metadata' | 'validation' | 'processing' | 'access'>('overview');

    // Editable metadata state
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editLicense, setEditLicense] = useState('');
    const [editDomain, setEditDomain] = useState('');

    useEffect(() => {
        const fetchDataset = async () => {
            const data = await api.getDatasetById(id || 'ds-1');
            setDataset(data);
            setEditName(data.name);
            setEditDesc(data.description);
            setEditLicense(data.license);
            setEditDomain(data.domain || 'Computer Vision');
        };
        fetchDataset();
    }, [id]);

    if (!dataset) return <div className="p-8 text-center text-xs text-muted-foreground">Loading dataset specifications...</div>;

    const handleSaveMetadata = () => {
        setDataset({
            ...dataset,
            name: editName,
            description: editDesc,
            license: editLicense,
            domain: editDomain,
        });
        setIsEditing(false);
        toast('success', 'Metadata updated', 'Dataset attributes saved successfully to catalog index.');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast('info', 'Copied to clipboard', text);
    };

    const mockFilesList = [
        { name: 'train_partition_001.parquet', path: 'part-00000.snappy.parquet', size: '14.2 GB', format: 'Parquet', status: 'VALID', date: '2 hours ago' },
        { name: 'train_partition_002.parquet', path: 'part-00001.snappy.parquet', size: '14.8 GB', format: 'Parquet', status: 'VALID', date: '2 hours ago' },
        { name: 'annotations_v3.jsonl', path: 'metadata/labels_v3.jsonl', size: '1.2 GB', format: 'JSONL', status: 'VALID', date: '3 hours ago' },
        { name: 'corrupted_frame_901.jpg', path: 'raw_frames/corrupted_frame_901.jpg', size: '4.2 MB', format: 'JPEG', status: 'CORRUPTED', date: '1 day ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Top Header Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-subtle space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-foreground tracking-tight">{dataset.name}</h1>
                                <TypeBadge type={dataset.type} />
                                <StatusBadge status={dataset.status} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                                {dataset.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(dataset.storageLocation)}
                            leftIcon={<Copy className="w-3.5 h-3.5" />}
                        >
                            S3 URI
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/validation')}
                            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                            Validate
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/versions')}
                            leftIcon={<GitBranch className="w-3.5 h-3.5" />}
                        >
                            Create Version
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => toast('success', 'Download Initiated', `Downloading ${dataset.name} (${dataset.sizeFormatted})`)}
                            leftIcon={<Download className="w-3.5 h-3.5" />}
                        >
                            Download
                        </Button>
                    </div>
                </div>

                {/* Info Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-border/50 text-xs">
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">TOTAL SIZE</span>
                        <span className="font-mono font-bold text-foreground text-sm">{dataset.sizeFormatted}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">TOTAL FILES</span>
                        <span className="font-mono font-bold text-foreground text-sm">{dataset.fileCount.toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">TOTAL RECORDS</span>
                        <span className="font-mono font-bold text-foreground text-sm">{(dataset.recordCount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">LATEST VERSION</span>
                        <span className="font-mono font-bold text-primary text-sm">{dataset.latestVersion}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">QUALITY SCORE</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">{dataset.qualityScore}%</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">LAST UPDATED</span>
                        <span className="font-semibold text-foreground text-xs mt-0.5 block truncate">{dataset.updatedAt}</span>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-border overflow-x-auto text-xs font-semibold text-muted-foreground gap-6">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'files', label: 'Files Browser' },
                    { id: 'versions', label: 'Versions Timeline' },
                    { id: 'metadata', label: 'Metadata & Tags' },
                    { id: 'validation', label: 'Validation Report' },
                    { id: 'processing', label: 'Processing Jobs' },
                    { id: 'access', label: 'Access Control' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'border-primary text-foreground font-bold'
                            : 'border-transparent hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB 1: Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 space-y-4">
                        <CardHeader>
                            <CardTitle>Dataset Specification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div>
                                <span className="font-semibold text-muted-foreground block mb-1">Description</span>
                                <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-md border border-border/50">
                                    {dataset.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-0.5">Storage Location</span>
                                    <code className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-1 rounded block truncate">
                                        {dataset.storageLocation}
                                    </code>
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-0.5">License</span>
                                    <span className="font-medium text-foreground">{dataset.license}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-0.5">Domain / Industry</span>
                                    <span className="font-medium text-foreground">{dataset.domain || 'Computer Vision'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-0.5">Classes / Labels Count</span>
                                    <span className="font-medium text-foreground">{dataset.classesCount || 120} distinct categories</span>
                                </div>
                            </div>

                            <div>
                                <span className="font-semibold text-muted-foreground block mb-2">Classification Tags</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {dataset.tags.map((t) => (
                                        <span key={t} className="px-2.5 py-1 rounded-md bg-muted text-foreground font-medium text-[11px]">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Owner & Quality Gauge */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dataset Ownership</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-3 text-xs">
                                <img src={dataset.ownerAvatar} alt={dataset.owner} className="w-10 h-10 rounded-full object-cover border border-border" />
                                <div>
                                    <h4 className="font-bold text-foreground">{dataset.owner}</h4>
                                    <p className="text-muted-foreground">Lead Data Engineer</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Created on {dataset.createdAt}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quality Index</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-4">
                                <div className="text-3xl font-extrabold text-emerald-400 font-mono">{dataset.qualityScore}%</div>
                                <p className="text-xs text-muted-foreground mt-1">Passed automated schema & duplicate scan</p>
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/validation')}>
                                    View Full Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB 2: Files Browser */}
            {activeTab === 'files' && (
                <Card className="p-0 overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold">
                            <tr>
                                <th className="py-3 px-4">File Name</th>
                                <th className="py-3 px-3">Path</th>
                                <th className="py-3 px-3">Size</th>
                                <th className="py-3 px-3">Format</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {mockFilesList.map((f, i) => (
                                <tr key={i} className="hover:bg-muted/30">
                                    <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                                        <FileCode className="w-4 h-4 text-primary shrink-0" />
                                        {f.name}
                                    </td>
                                    <td className="py-3 px-3 font-mono text-muted-foreground">{f.path}</td>
                                    <td className="py-3 px-3 font-mono">{f.size}</td>
                                    <td className="py-3 px-3">{f.format}</td>
                                    <td className="py-3 px-3">
                                        <StatusBadge status={f.status} />
                                    </td>
                                    <td className="py-3 px-3 text-muted-foreground">{f.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            {/* TAB 3: Versions Timeline */}
            {activeTab === 'versions' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Version History Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {mockVersions.map((v) => (
                            <div key={v.version} className="flex gap-4 items-start border-l-2 border-primary/40 pl-4 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-foreground flex items-center gap-2">
                                            Version {v.version} {v.isCurrent && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">Current</span>}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{v.createdAt}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{v.changesDescription}</p>
                                    <div className="flex gap-4 text-[11px] font-mono text-muted-foreground pt-1">
                                        <span>Size: <b>{v.sizeFormatted}</b></span>
                                        <span>Files: <b>{v.fileCount.toLocaleString()}</b></span>
                                        <span>Duplicates: <b>{v.duplicateCount.toLocaleString()}</b></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* TAB 4: Editable Metadata */}
            {activeTab === 'metadata' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle>Editable Dataset Metadata</CardTitle>
                            {!isEditing ? (
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                                    Edit Metadata
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} leftIcon={<X className="w-3.5 h-3.5" />}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSaveMetadata} leftIcon={<Save className="w-3.5 h-3.5" />}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 text-xs">
                        <div>
                            <label className="font-semibold text-muted-foreground block mb-1">Dataset Name</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground disabled:opacity-60"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-muted-foreground block mb-1">Description</label>
                            <textarea
                                rows={3}
                                disabled={!isEditing}
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground disabled:opacity-60"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-muted-foreground block mb-1">License</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={editLicense}
                                    onChange={(e) => setEditLicense(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground disabled:opacity-60"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-muted-foreground block mb-1">Domain</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={editDomain}
                                    onChange={(e) => setEditDomain(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground disabled:opacity-60"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 5: Validation Report Quick Link */}
            {activeTab === 'validation' && (
                <Card className="text-center py-8 space-y-4">
                    <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-base font-bold text-foreground">Validation Report Index</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Quality Score: 96.7% • 12,430 duplicate records detected.
                    </p>
                    <Button size="sm" onClick={() => navigate('/validation')}>
                        Open Detailed Quality Validation Dashboard
                    </Button>
                </Card>
            )}

            {/* TAB 6: Processing Jobs */}
            {activeTab === 'processing' && (
                <Card className="text-center py-8 space-y-4">
                    <Database className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-base font-bold text-foreground">Dataset Processing Pipeline</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Job #9021 running: Spark Deduplication & Parquet Encoding.
                    </p>
                    <Button size="sm" onClick={() => navigate('/jobs')}>
                        View Live Processing Terminal Logs
                    </Button>
                </Card>
            )}

            {/* TAB 7: Access Control */}
            {activeTab === 'access' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Dataset RBAC Access Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded border border-border">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-emerald-400" />
                                <div>
                                    <span className="font-semibold text-foreground">Admin & Data Engineer Group</span>
                                    <span className="block text-[10px] text-muted-foreground">Full Read / Write / Delete permissions</span>
                                </div>
                            </div>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">GRANTED</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded border border-border">
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-400" />
                                <div>
                                    <span className="font-semibold text-foreground">ML Engineer Group</span>
                                    <span className="block text-[10px] text-muted-foreground">Read / Download / Version Creation</span>
                                </div>
                            </div>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono">GRANTED</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
