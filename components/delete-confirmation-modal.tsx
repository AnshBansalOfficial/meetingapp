'use client';

import { Modal } from './modal';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{message}</p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded border border-border text-foreground hover:bg-card transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-red-900/30 border border-red-800/50 text-red-400 font-medium hover:bg-red-900/50 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
