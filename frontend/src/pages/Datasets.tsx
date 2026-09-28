import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Database,
    Search,
    Filter,
    Grid,
    List,
    Upload,
    Plus,
    ArrowUpDown,
    MoreVertical,
    CheckSquare,
    Square,
    Eye,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { UploadModal } from '../components/upload/UploadModal';
import { api } from '../services/api';
import { Dataset, DatasetType, DatasetStatus } from '../types';

export const Datasets: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDatasets = async () => {
            const data = await api.getDatasets();
            setDatasets(data);
        };
        loadDatasets();
    }, []);

    const filteredDatasets = datasets.filter((ds) => {
        const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || ds.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = selectedType === 'ALL' || ds.type === selectedType;
        const matchesStatus = selectedStatus === 'ALL' || ds.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredDatasets.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredDatasets.map((d) => d.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header & Main Top Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Datasets Catalog</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Manage, validate, version, and prepare distributed datasets for AI training models.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsUploadOpen(true)}
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                        Upload Dataset
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsUploadOpen(true)}
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                        Create Dataset
                    </Button>
                </div>
            </div>

            {/* Control Bar: Search, Filters, View Switcher */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-subtle">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search dataset name, tags, license, domain..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter Popover Toggle */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            leftIcon={<Filter className="w-3.5 h-3.5" />}
                        >
                            Filter {(selectedType !== 'ALL' || selectedStatus !== 'ALL') && '• Active'}
                        </Button>

                        {/* Filter Popover Menu */}
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 p-4 space-y-3">
                                <h4 className="text-xs font-bold text-foreground border-b border-border pb-2">Filter Datasets</h4>

                                <div>
                                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Dataset Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded border border-border bg-background text-xs text-foreground"
                                    >
                                        <option value="ALL">All Types</option>
                                        <option value="IMAGE">IMAGE</option>
                                        <option value="TEXT">TEXT</option>
                                        <option value="AUDIO">AUDIO</option>
                                        <option value="VIDEO">VIDEO</option>
                                        <option value="TABULAR">TABULAR</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Processing Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded border border-border bg-background text-xs text-foreground"
                                    >
                                        <option value="ALL">All Statuses</option>
                                        <option value="READY">READY</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="FAILED">FAILED</option>
                                        <option value="UPLOADING">UPLOADING</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                    <button
                                        onClick={() => {
                                            setSelectedType('ALL');
                                            setSelectedStatus('ALL');
                                            setIsFilterOpen(false);
                                        }}
                                        className="text-[11px] text-muted-foreground hover:text-foreground"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Switcher Toggle Buttons */}
                    <div className="flex items-center bg-muted p-1 rounded-md border border-border">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            title="Table view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            title="Grid view"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE VIEW */}
            {viewMode === 'table' ? (
                <Card className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                                <tr>
                                    <th className="py-3 px-4 w-10">
                                        <button onClick={toggleSelectAll}>
                                            {selectedIds.length === filteredDatasets.length && filteredDatasets.length > 0 ? (
                                                <CheckSquare className="w-4 h-4 text-primary" />
                                            ) : (
                                                <Square className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="py-3 px-4">Dataset Name</th>
                                    <th className="py-3 px-3">Type</th>
                                    <th className="py-3 px-3">Size</th>
                                    <th className="py-3 px-3">Files / Records</th>
                                    <th className="py-3 px-3">Version</th>
                                    <th className="py-3 px-3">Quality Score</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">Updated</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 font-medium">
                                {filteredDatasets.map((ds) => {
                                    const isSelected = selectedIds.includes(ds.id);
                                    return (
                                        <tr
                                            key={ds.id}
                                            onClick={() => navigate(`/datasets/${ds.id}`)}
                                            className={`hover:bg-muted/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''
                                                }`}
                                        >
                                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => toggleSelectOne(ds.id)}>
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-primary" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Database className="w-4 h-4 text-primary shrink-0" />
                                                    <div>
                                                        <span>{ds.name}</span>
                                                        <span className="block text-[10px] text-muted-foreground font-normal">{ds.owner}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3"><TypeBadge type={ds.type} /></td>
                                            <td className="py-3 px-3 text-muted-foreground font-mono">{ds.sizeFormatted}</td>
                                            <td className="py-3 px-3 text-muted-foreground">
                                                {ds.fileCount.toLocaleString()} files
                                                <span className="block text-[10px] text-muted-foreground">{(ds.recordCount / 1000000).toFixed(1)}M records</span>
                                            </td>
                                            <td className="py-3 px-3 font-mono font-semibold text-primary">{ds.latestVersion}</td>
                                            <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">{ds.qualityScore}%</td>
                                            <td className="py-3 px-3"><StatusBadge status={ds.status} /></td>
                                            <td className="py-3 px-3 text-muted-foreground">{ds.updatedAt}</td>
                                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/datasets/${ds.id}`)}
                                                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                /* GRID CARD VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDatasets.map((ds) => (
                        <Card
                            key={ds.id}
                            hoverable
                            onClick={() => navigate(`/datasets/${ds.id}`)}
                            className="flex flex-col justify-between space-y-4"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Database className="w-4 h-4 text-primary shrink-0" />
                                        <TypeBadge type={ds.type} />
                                    </div>
                                    <StatusBadge status={ds.status} />
                                </div>

                                <h3 className="font-bold text-sm text-foreground tracking-tight leading-snug">{ds.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                    {ds.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50 text-[11px]">
                                <div>
                                    <span className="text-muted-foreground block text-[10px]">SIZE</span>
                                    <span className="font-mono font-semibold text-foreground">{ds.sizeFormatted}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px]">VERSION</span>
                                    <span className="font-mono font-semibold text-primary">{ds.latestVersion}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px]">QUALITY</span>
                                    <span className="font-mono font-semibold text-emerald-400">{ds.qualityScore}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                <div className="flex items-center gap-1.5">
                                    <img src={ds.ownerAvatar} alt={ds.owner} className="w-5 h-5 rounded-full object-cover" />
                                    <span>{ds.owner}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px]">
                                    <Clock className="w-3 h-3" />
                                    <span>{ds.updatedAt}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Dataset Modal */}
            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    );
};
