import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { CommandPalette } from '../ui/CommandPalette';
import { mockUsers, mockNotifications } from '../../services/api';

export const AppLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const currentUser = mockUsers[0];

    // Theme Syncing Effect
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Command Palette Keyboard Shortcut Listener (Cmd+K / Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
            {/* Sidebar Navigation */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                currentUser={currentUser}
            />

            {/* Main Container Wrapper */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
                    }`}
            >
                {/* Top Header */}
                <Header
                    onOpenSearch={() => setIsCommandPaletteOpen(true)}
                    onOpenMobileMenu={() => setIsMobileOpen(true)}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    currentUser={currentUser}
                    notifications={mockNotifications}
                />

                {/* Page Content View Area */}
                <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                    <Breadcrumbs />
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t border-border/50 py-4 px-6 text-center text-xs text-muted-foreground select-none">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
                        <span>© 2026 DataLake AI Platform. Distributed Training Infrastructure.</span>
                        <div className="flex items-center gap-4 text-[11px]">
                            <span className="hover:underline cursor-pointer">API Docs</span>
                            <span>•</span>
                            <span className="hover:underline cursor-pointer">Privacy & Security</span>
                            <span>•</span>
                            <span className="hover:underline cursor-pointer">System Status: <span className="text-emerald-400 font-semibold">100% Operational</span></span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Global Command Palette */}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
            />
        </div>
    );
};
