import React, { useState } from 'react';
import {
    Search,
    Bell,
    Sun,
    Moon,
    Menu,
    ChevronDown,
    User as UserIcon,
    Shield,
    LogOut,
    Check,
    CheckCheck
} from 'lucide-react';
import { User, NotificationItem } from '../../types';

export interface HeaderProps {
    onOpenSearch: () => void;
    onOpenMobileMenu: () => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
    currentUser: User;
    notifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
    onOpenSearch,
    onOpenMobileMenu,
    theme,
    onToggleTheme,
    currentUser,
    notifications,
}) => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [localNotifs, setLocalNotifs] = useState(notifications);

    const unreadCount = localNotifs.filter((n) => !n.read).length;

    const handleMarkAllRead = () => {
        setLocalNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 flex items-center justify-between transition-colors">
            {/* Mobile Drawer Trigger & Search Trigger */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
                <button
                    onClick={onOpenMobileMenu}
                    className="md:hidden p-2 rounded-md hover:bg-muted text-muted-foreground"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Global Search Bar Button */}
                <button
                    onClick={onOpenSearch}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-primary/40 text-xs text-muted-foreground transition-all duration-150 group shadow-subtle"
                >
                    <div className="flex items-center gap-2.5">
                        <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>Search datasets, processing jobs, users, versions...</span>
                    </div>
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                        <span className="text-[11px]">⌘</span> K
                    </kbd>
                </button>
            </div>

            {/* Right Controls: Notifications, Theme, Profile */}
            <div className="flex items-center gap-2.5 ml-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {/* Notifications Popover Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen);
                            setIsUserMenuOpen(false);
                        }}
                        className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-mono">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[11px] text-primary hover:underline flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-3 h-3" /> Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                                {localNotifs.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-3.5 text-xs transition-colors hover:bg-muted/40 ${!n.read ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-foreground">{n.title}</p>
                                            <span className="text-[10px] text-muted-foreground shrink-0">{n.timestamp}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-1 leading-snug">{n.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown Menu */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsUserMenuOpen(!isUserMenuOpen);
                            setIsNotifOpen(false);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                    >
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-7 h-7 rounded-full object-cover border border-border"
                        />
                        <span className="hidden sm:inline text-xs font-medium text-foreground">{currentUser.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <div className="px-3 py-2 border-b border-border mb-1">
                                <p className="text-xs font-semibold text-foreground">{currentUser.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
                                <span className="inline-block mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-medium">
                                    {currentUser.role}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    alert('Navigating to profile');
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors text-left"
                            >
                                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" /> Profile & Account
                            </button>
                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    alert('Navigating to security');
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors text-left"
                            >
                                <Shield className="w-3.5 h-3.5 text-muted-foreground" /> Security & API Keys
                            </button>
                            <div className="border-t border-border pt-1">
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        alert('Signed out');
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors text-left"
                                >
                                    <LogOut className="w-3.5 h-3.5" /> Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
