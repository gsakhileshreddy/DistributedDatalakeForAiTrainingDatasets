import React, { useState } from 'react';
import {
    User,
    Shield,
    Bell,
    HardDrive,
    Key,
    Sliders,
    CheckCircle2,
    Copy,
    Plus,
    Trash2,
    RefreshCw,
    Save
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useToast } from '../components/ui/ToastContext';

export const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'storage' | 'apikeys' | 'preferences'>('storage');

    // Storage Settings State
    const [s3AccessKey, setS3AccessKey] = useState('AKIAIOSFODNN7EXAMPLE');
    const [s3SecretKey, setS3SecretKey] = useState('••••••••••••••••••••••••••••••••');
    const [s3Region, setS3Region] = useState('us-east-1');
    const [s3Bucket, setS3Bucket] = useState('datalake-ai-production-cluster');

    // API Keys State
    const [apiKeys, setApiKeys] = useState([
        { id: 'key-1', name: 'Spark ETL Worker Key', prefix: 'dl_live_90f2...', created: '2026-08-15', lastUsed: '10 mins ago' },
        { id: 'key-2', name: 'PyTorch Model Training Pipeline', prefix: 'dl_live_14a8...', created: '2026-08-20', lastUsed: '1 hour ago' },
    ]);

    const { toast } = useToast();

    const handleSaveSettings = () => {
        toast('success', 'Settings Saved', 'Platform configuration updated successfully.');
    };

    const handleCreateAPIKey = () => {
        const created = {
            id: `key-${Date.now()}`,
            name: 'New Custom Ingestion Key',
            prefix: `dl_live_${Math.random().toString(36).substr(2, 6)}...`,
            created: 'Just now',
            lastUsed: 'Never',
        };
        setApiKeys([...apiKeys, created]);
        toast('success', 'API Key Created', 'New API bearer token generated.');
    };

    const handleRevokeKey = (id: string) => {
        setApiKeys(apiKeys.filter((k) => k.id !== id));
        toast('warning', 'API Key Revoked', 'Token invalidated.');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Settings & Connections</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Configure S3 storage connectors, API access keys, alert webhooks, and security policies.
                    </p>
                </div>
                <Button onClick={handleSaveSettings} leftIcon={<Save className="w-4 h-4" />}>
                    Save Preferences
                </Button>
            </div>

            {/* Settings Navigation Tabs */}
            <div className="flex border-b border-border overflow-x-auto text-xs font-semibold text-muted-foreground gap-6">
                {[
                    { id: 'storage', label: 'Storage Providers', icon: HardDrive },
                    { id: 'apikeys', label: 'API Keys', icon: Key },
                    { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
                    { id: 'security', label: 'Security & Auth', icon: Shield },
                    { id: 'profile', label: 'User Profile', icon: User },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-foreground font-bold'
                                : 'border-transparent hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* STORAGE PROVIDERS TAB */}
            {activeTab === 'storage' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 space-y-4">
                        <CardHeader>
                            <CardTitle>AWS S3 / MinIO Cluster Credentials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">AWS Access Key ID</label>
                                    <input
                                        type="text"
                                        value={s3AccessKey}
                                        onChange={(e) => setS3AccessKey(e.target.value)}
                                        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">AWS Secret Access Key</label>
                                    <input
                                        type="password"
                                        value={s3SecretKey}
                                        onChange={(e) => setS3SecretKey(e.target.value)}
                                        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">Default Region</label>
                                    <input
                                        type="text"
                                        value={s3Region}
                                        onChange={(e) => setS3Region(e.target.value)}
                                        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-foreground block mb-1">Production Bucket Name</label>
                                    <input
                                        type="text"
                                        value={s3Bucket}
                                        onChange={(e) => setS3Bucket(e.target.value)}
                                        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toast('success', 'S3 Ping Successful', 'Connected to s3://datalake-ai-production-cluster in 42ms.')}
                                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                                >
                                    Test Connection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* API KEYS TAB */}
            {activeTab === 'apikeys' && (
                <Card className="space-y-4">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <CardTitle>Platform Bearer API Keys</CardTitle>
                            </div>
                            <Button size="sm" onClick={handleCreateAPIKey} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                                Generate New Key
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Key Identifier</th>
                                    <th className="py-3 px-3">Token Prefix</th>
                                    <th className="py-3 px-3">Created</th>
                                    <th className="py-3 px-3">Last Used</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50 font-medium">
                                {apiKeys.map((k) => (
                                    <tr key={k.id} className="hover:bg-muted/30">
                                        <td className="py-3.5 px-4 font-bold text-foreground">{k.name}</td>
                                        <td className="py-3.5 px-3 font-mono text-primary font-semibold">{k.prefix}</td>
                                        <td className="py-3.5 px-3 text-muted-foreground">{k.created}</td>
                                        <td className="py-3.5 px-3 text-muted-foreground">{k.lastUsed}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => handleRevokeKey(k.id)}
                                                className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400"
                                                title="Revoke Key"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <Card className="space-y-4">
                    <CardHeader>
                        <CardTitle>Alert Notification Webhooks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        <div>
                            <label className="font-semibold text-foreground block mb-1">Slack Incident Webhook URL</label>
                            <input
                                type="text"
                                placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXX"
                                className="w-full px-3 py-2 rounded border border-border bg-background font-mono text-foreground"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <Card className="space-y-4">
                    <CardHeader>
                        <CardTitle>Enterprise Security Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded border border-border">
                            <div>
                                <span className="font-bold text-foreground block">Enforce 2FA Multi-Factor Authentication</span>
                                <span className="text-[10px] text-muted-foreground">Require hardware TOTP for all Data Engineer roles</span>
                            </div>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">ENABLED</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
