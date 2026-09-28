import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-subtle',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
        outline: 'border border-border bg-background hover:bg-muted text-foreground focus:ring-primary',
        ghost: 'hover:bg-muted hover:text-foreground text-muted-foreground focus:ring-primary',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    };

    const sizes = {
        sm: 'text-xs px-2.5 py-1.5 gap-1.5',
        md: 'text-sm px-3.5 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </button>
    );
};
