import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Search,
    UserPlus,
    Shield,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Key
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/ToastContext';
import { api } from '../services/api';
import { User, UserRole } from '../types';

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole>('ML Engineer');

    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await api.getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const created: User = {
            id: `usr-${Date.now()}`,
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            status: 'ACTIVE',
            lastActive: 'Just now',
        };
        setUsers([created, ...users]);
        setIsAddUserOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        toast('success', 'User Invited', `${newUserName} invited as ${newUserRole}.`);
    };

    const toggleUserStatus = (id: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u))
        );
        toast('info', 'Status Updated', 'User access permissions recalculated.');
    };

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">User Access & RBAC Management</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Control enterprise permissions, security roles, and user lifecycle states.
                    </p>
                </div>
                <Button onClick={() => setIsAddUserOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
                    Add Platform User
                </Button>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-subtle">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, email, or role..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Users Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-3">Role</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Last Active</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-medium">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-3">
                                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                                        <div>
                                            <span>{u.name}</span>
                                            <span className="block text-[10px] text-muted-foreground font-mono">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 font-semibold text-foreground">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${u.role === 'Admin'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : u.role === 'Data Engineer'
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${u.status === 'ACTIVE'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}
                                        >
                                            {u.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-muted-foreground">{u.lastActive}</td>
                                    <td className="py-3.5 px-4 text-right">
                                        <Button
                                            variant={u.status === 'ACTIVE' ? 'outline' : 'secondary'}
                                            size="sm"
                                            onClick={() => toggleUserStatus(u.id)}
                                        >
                                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ADD USER MODAL */}
            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} maxWidth="md">
                <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                    <h3 className="text-base font-bold text-foreground">Invite Platform User</h3>

                    <div>
                        <label className="font-semibold text-foreground block mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-foreground block mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="sarah@datalake.ai"
                            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-foreground block mb-1">Assign Role</label>
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                        >
                            <option value="Admin">Admin (Full Control)</option>
                            <option value="Data Engineer">Data Engineer (Ingestion & Spark)</option>
                            <option value="ML Engineer">ML Engineer (Versioning & Training)</option>
                            <option value="Viewer">Viewer (Read-only)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setIsAddUserOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" type="submit">
                            Send Invite
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
