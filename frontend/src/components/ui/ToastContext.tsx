import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextType {
    toast: (type: ToastType, title: string, message?: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);

        setTimeout(() => {
            removeToast(id);
        }, 4500);
    }, [removeToast]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <XCircle className="w-5 h-5 text-rose-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        info: <Info className="w-5 h-5 text-sky-400" />,
    };

    const borders = {
        success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
        error: 'border-rose-500/30 bg-rose-950/90 text-rose-100',
        warning: 'border-amber-500/30 bg-amber-950/90 text-amber-100',
        info: 'border-sky-500/30 bg-sky-950/90 text-sky-100',
    };

    return (
        <ToastContext.Provider value={{ toast, removeToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md shadow-xl text-xs font-sans ${borders[t.type]}`}
                        >
                            <div className="mt-0.5">{icons[t.type]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold tracking-tight">{t.title}</p>
                                {t.message && <p className="opacity-80 mt-0.5 leading-snug">{t.message}</p>}
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
