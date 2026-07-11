'use client';

import { useToast } from '@/lib/toast-context';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const bgColor = {
          success: 'bg-green-900/90',
          error: 'bg-red-900/90',
          info: 'bg-blue-900/90',
          warning: 'bg-yellow-900/90',
        }[toast.type];

        const icon = {
          success: <CheckCircle className="w-5 h-5 text-green-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          info: <Info className="w-5 h-5 text-blue-400" />,
          warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`${bgColor} border border-white/10 rounded-lg p-4 flex items-start gap-3 text-white shadow-lg animate-in slide-in-from-right-4 fade-in-0`}
          >
            {icon}
            <div className="flex-1 text-sm">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
