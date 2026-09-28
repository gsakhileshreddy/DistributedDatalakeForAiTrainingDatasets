import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Cpu,
    HardDrive,
    BrainCircuit,
    Users,
    ShieldCheck,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Layers,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { User } from '../../types';

export interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    onToggleCollapse,
    isMobileOpen,
    onCloseMobile,
    currentUser,
}) => {
    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Datasets', path: '/datasets', icon: Database, badge: '5' },
        { label: 'Processing Jobs', path: '/jobs', icon: Cpu, badge: '1 Running' },
        { label: 'Storage', path: '/storage', icon: HardDrive },
        { label: 'AI Training', path: '/training', icon: BrainCircuit },
        { label: 'Users & Roles', path: '/users', icon: Users },
        { label: 'Audit Logs', path: '/audit', icon: ShieldCheck },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg select-none">
            {/* Brand Header */}
            <div className={clsx('flex items-center justify-between h-16 px-4 border-b border-sidebar-border', isCollapsed && 'justify-center px-2')}>
                <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-glow shrink-0">
                        <Layers className="w-5 h-5" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground tracking-tight leading-none">DataLake AI</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Enterprise v3.2</span>
                        </div>
                    )}
                </NavLink>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden md:flex p-1.5 rounded-md hover:bg-sidebar-hover text-muted-foreground hover:text-foreground transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={onCloseMobile}
                    className="flex md:hidden p-1.5 rounded-md hover:bg-sidebar-hover text-muted-foreground"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main Navigation Links */}
            <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-150 group relative',
                                isActive
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-subtle'
                                    : 'text-sidebar-fg/80 hover:bg-sidebar-hover hover:text-foreground',
                                isCollapsed && 'justify-center px-2'
                            )
                        }
                    >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && (
                            <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!isCollapsed && item.badge && (
                            <span className={clsx('text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium', item.badge.includes('Running') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-muted/80 text-muted-foreground')}>
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Footer / User & Help Section */}
            <div className="p-3 border-t border-sidebar-border space-y-2">
                <button
                    className={clsx('w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-sidebar-fg/70 hover:bg-sidebar-hover hover:text-foreground transition-colors', isCollapsed && 'justify-center px-2')}
                >
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Help & Docs</span>}
                </button>

                <div className={clsx('flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-sidebar-border/50', isCollapsed && 'justify-center p-1.5')}>
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-border"
                    />
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{currentUser.role}</p>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button
                            onClick={() => alert('Logged out successfully')}
                            className="p-1 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Persistent Sidebar */}
            <aside
                className={clsx(
                    'hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out',
                    isCollapsed ? 'w-16' : 'w-64'
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Navigation */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
                    <div className="relative w-72 max-w-full bg-sidebar-bg h-full shadow-2xl z-10">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
};
