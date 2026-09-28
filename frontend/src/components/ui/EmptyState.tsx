import React from 'react';
import { Database, Plus } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No datasets yet',
    description = 'Upload your first dataset to start building your AI data pipeline.',
    icon = <Database className="w-10 h-10 text-muted-foreground/60" />,
    actionLabel = 'Upload Dataset',
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/40 text-center max-w-lg mx-auto my-8">
            <div className="p-4 rounded-full bg-muted/50 mb-4">{icon}</div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
                {description}
            </p>
            {onAction && (
                <Button onClick={onAction} leftIcon={<Plus className="w-4 h-4" />}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
