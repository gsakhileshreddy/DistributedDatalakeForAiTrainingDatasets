import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Cpu, HardDrive, Users, Settings, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { mockDatasets, mockProcessingJobs, mockUsers } from '../../services/api';

export interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) setQuery('');
    }, [isOpen]);

    const filteredDatasets = mockDatasets.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );

    const filteredJobs = mockProcessingJobs.filter((j) =>
        j.datasetName.toLowerCase().includes(query.toLowerCase()) || j.operation.toLowerCase().includes(query.toLowerCase())
    );

    const filteredUsers = mockUsers.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase())
    );

    const quickLinks = [
        { label: 'Dashboard Overview', path: '/', icon: <Database className="w-4 h-4 text-blue-400" /> },
        { label: 'Datasets Catalog', path: '/datasets', icon: <Database className="w-4 h-4 text-purple-400" /> },
        { label: 'Processing Jobs Monitoring', path: '/jobs', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
        { label: 'Storage Analytics', path: '/storage', icon: <HardDrive className="w-4 h-4 text-amber-400" /> },
        { label: 'AI Training Workflows', path: '/ai-training', icon: <Cpu className="w-4 h-4 text-sky-400" /> },
        { label: 'User & RBAC Management', path: '/users', icon: <Users className="w-4 h-4 text-indigo-400" /> },
        { label: 'Security Audit Logs', path: '/audit-logs', icon: <ShieldCheck className="w-4 h-4 text-rose-400" /> },
        { label: 'Platform Settings', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
    ];

    const handleSelect = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="-m-6">
                {/* Command Search Input Bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search datasets, jobs, users, versions..."
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                        autoFocus
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground">
                        ESC
                    </kbd>
                </div>

                {/* Results Body */}
                <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
                    {/* Quick Navigation Links */}
                    {query.trim() === '' && (
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-1.5">
                                Quick Navigation
                            </div>
                            <div className="space-y-1">
                                {quickLinks.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(link.path)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {link.icon}
                                            <span className="font-medium">{link.label}</span>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtered Datasets */}
                    {filteredDatasets.length > 0 && (
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-1.5">
                                Datasets ({filteredDatasets.length})
                            </div>
                            <div className="space-y-1">
                                {filteredDatasets.map((ds) => (
                                    <button
                                        key={ds.id}
                                        onClick={() => handleSelect(`/datasets/${ds.id}`)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted rounded-md transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Database className="w-4 h-4 text-primary" />
                                            <div>
                                                <span className="font-semibold text-foreground">{ds.name}</span>
                                                <span className="text-muted-foreground ml-2">({ds.type} • {ds.sizeFormatted})</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground">{ds.latestVersion}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtered Processing Jobs */}
                    {filteredJobs.length > 0 && (
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-1.5">
                                Processing Jobs ({filteredJobs.length})
                            </div>
                            <div className="space-y-1">
                                {filteredJobs.map((j) => (
                                    <button
                                        key={j.id}
                                        onClick={() => handleSelect('/jobs')}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted rounded-md transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Cpu className="w-4 h-4 text-emerald-400" />
                                            <div>
                                                <span className="font-semibold text-foreground">{j.operation}</span>
                                                <span className="text-muted-foreground ml-2">— {j.datasetName}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground">{j.status}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtered Users */}
                    {filteredUsers.length > 0 && (
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-1.5">
                                Team & Users ({filteredUsers.length})
                            </div>
                            <div className="space-y-1">
                                {filteredUsers.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => handleSelect('/users')}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted rounded-md transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                                            <span className="font-semibold text-foreground">{u.name}</span>
                                            <span className="text-muted-foreground">({u.email})</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{u.role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
