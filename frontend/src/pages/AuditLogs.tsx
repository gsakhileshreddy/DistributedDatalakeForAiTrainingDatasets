import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Filter,
    Shield,
    Clock,
    User,
    Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/ToastContext';
import { api } from '../services/api';
import { AuditLog } from '../types';

export const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAction, setSelectedAction] = useState('ALL');
    const { toast } = useToast();

    useEffect(() => {
        const fetchLogs = async () => {
            const data = await api.getAuditLogs();
            setLogs(data);
        };
        fetchLogs();
    }, []);

    const handleExportCSV = () => {
        const headers = 'ID,User,Action,Resource,Timestamp,IP Address\n';
        const rows = filteredLogs
            .map((l) => `"${l.id}","${l.user}","${l.action}","${l.resource}","${l.timestamp}","${l.ipAddress}"`)
            .join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${Date.now()}.csv`;
        a.click();
        toast('success', 'Audit Trail Exported', 'CSV file downloaded to computer.');
    };

    const filteredLogs = logs.filter((l) => {
        const matchesSearch =
            l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.resource.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAction = selectedAction === 'ALL' || l.action === selectedAction;
        return matchesSearch && matchesAction;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">System Audit Log Trail</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Immutable SOC-2 Type II audit trail of user actions, API calls, and dataset mutations.
                    </p>
                </div>
                <Button onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
                    Export CSV Audit Log
                </Button>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-subtle">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search user, action, resource, or IP..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border bg-background text-xs text-foreground font-medium"
                >
                    <option value="ALL">All Event Types</option>
                    <option value="DATASET_UPLOAD">DATASET_UPLOAD</option>
                    <option value="VERSION_CREATE">VERSION_CREATE</option>
                    <option value="JOB_STARTED">JOB_STARTED</option>
                    <option value="QUALITY_VALIDATION">QUALITY_VALIDATION</option>
                    <option value="USER_LOGIN">USER_LOGIN</option>
                    <option value="PERMISSION_CHANGE">PERMISSION_CHANGE</option>
                </select>
            </div>

            {/* Audit Logs Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Event ID</th>
                                <th className="py-3 px-3">Timestamp</th>
                                <th className="py-3 px-3">User</th>
                                <th className="py-3 px-3">Action Event</th>
                                <th className="py-3 px-4">Target Resource</th>
                                <th className="py-3 px-4 text-right">Client IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {filteredLogs.map((l) => (
                                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3.5 px-4 font-mono text-muted-foreground text-[11px]">{l.id}</td>
                                    <td className="py-3.5 px-3 text-muted-foreground whitespace-nowrap font-mono">{l.timestamp}</td>
                                    <td className="py-3.5 px-3 font-semibold text-foreground flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                                        {l.user}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-muted text-foreground border border-border">
                                            {l.action}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">{l.resource}</td>
                                    <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">{l.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
