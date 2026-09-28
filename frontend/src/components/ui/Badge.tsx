import React from 'react';
import { clsx } from 'clsx';
import { DatasetStatus, JobStatus, DatasetType } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide uppercase';

    const variants = {
        default: 'bg-muted text-muted-foreground border border-border/50',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
        info: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
        outline: 'border border-border text-foreground',
    };

    const sizes = {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
    };

    return (
        <span className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
            {children}
        </span>
    );
};

export const StatusBadge: React.FC<{ status: DatasetStatus | JobStatus | string }> = ({ status }) => {
    switch (status) {
        case 'READY':
        case 'COMPLETED':
        case 'Active':
        case 'SUCCESS':
        case 'VALID':
            return <Badge variant="success">{status}</Badge>;
        case 'PROCESSING':
        case 'RUNNING':
        case 'UPLOADING':
            return <Badge variant="info" className="animate-pulse">{status}</Badge>;
        case 'QUEUED':
        case 'WARNING':
            return <Badge variant="warning">{status}</Badge>;
        case 'FAILED':
        case 'Inactive':
        case 'CORRUPTED':
            return <Badge variant="danger">{status}</Badge>;
        default:
            return <Badge variant="default">{status}</Badge>;
    }
};

export const TypeBadge: React.FC<{ type: DatasetType }> = ({ type }) => {
    const colors: Record<DatasetType, string> = {
        IMAGE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        TEXT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        AUDIO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        VIDEO: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        TABULAR: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };

    return (
        <span className={clsx('inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border tracking-wider', colors[type])}>
            {type}
        </span>
    );
};
