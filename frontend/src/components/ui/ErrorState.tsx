import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    description = "We couldn't load your datasets or metrics from the data lake.",
    onRetry,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 border border-rose-500/20 bg-rose-500/5 rounded-xl text-center max-w-md mx-auto my-8">
            <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 mb-3">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-5 leading-relaxed">{description}</p>
            {onRetry && (
                <Button variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Try Again
                </Button>
            )}
        </div>
    );
};
