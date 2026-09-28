import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
    const [email, setEmail] = useState('alex.rivera@datalake.ai');
    const [password, setPassword] = useState('••••••••••••');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/');
        }, 600);
    };

    const roles: { role: UserRole; desc: string }[] = [
        { role: 'Admin', desc: 'Full infrastructure control, user access & API keys' },
        { role: 'Data Engineer', desc: 'Dataset ingestion, Spark processing & storage policies' },
        { role: 'ML Engineer', desc: 'Dataset versioning, validation & AI model training' },
        { role: 'Viewer', desc: 'Read-only access to dataset catalog & audit logs' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Subtle Background Glow Accent */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-6 z-10">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-primary text-primary-foreground shadow-glow mb-2">
                        <Layers className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">DataLake AI</h1>
                    <p className="text-xs text-muted-foreground">
                        Distributed Data Lake & AI Training Dataset Infrastructure
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-elevated space-y-5">
                    <form onSubmit={handleLogin} className="space-y-4 text-xs">
                        <div>
                            <label className="font-semibold text-foreground block mb-1">Corporate Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-foreground">Password</label>
                                <span className="text-[11px] text-primary hover:underline cursor-pointer">Forgot password?</span>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Role Simulation Selector */}
                        <div>
                            <label className="font-semibold text-foreground block mb-1">Simulate Login Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                {roles.map((r) => (
                                    <button
                                        key={r.role}
                                        type="button"
                                        onClick={() => setSelectedRole(r.role)}
                                        className={`p-2.5 rounded-md border text-left transition-all ${selectedRole === r.role
                                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                                            : 'border-border bg-background hover:bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs">{r.role}</span>
                                            {selectedRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-2.5"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Sign In to Platform
                        </Button>
                    </form>

                    {/* SSO Options */}
                    <div className="border-t border-border pt-4 text-center space-y-3">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                            Or sign in with Single Sign-On (SSO)
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/')}
                                leftIcon={<Lock className="w-3.5 h-3.5" />}
                            >
                                Okta SAML
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/')}
                                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                            >
                                Azure AD SSO
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[11px] text-muted-foreground">
                    Protected by enterprise-grade TLS 1.3 & SOC-2 Type II Compliance.
                </p>
            </div>
        </div>
    );
};
