import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>

                    <div className="flex items-center justify-end gap-2.5 mt-6">
                        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                            {cancelText}
                        </Button>
                        <Button variant={variant === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm} isLoading={isLoading}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
