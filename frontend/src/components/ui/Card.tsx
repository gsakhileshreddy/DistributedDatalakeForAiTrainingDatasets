import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverable = false,
    bordered = true,
    ...props
}) => {
    return (
        <div
            className={clsx(
                'bg-card text-card-foreground rounded-lg p-5 transition-all duration-200',
                bordered && 'border border-border',
                hoverable && 'hover:border-primary/40 hover:shadow-subtle cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={clsx('flex items-center justify-between pb-3 border-b border-border/50 mb-4', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
    <h3 className={clsx('text-base font-semibold tracking-tight text-foreground', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
    <p className={clsx('text-xs text-muted-foreground mt-0.5', className)} {...props}>
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
    <div className={clsx('', className)} {...props}>
        {children}
    </div>
);
