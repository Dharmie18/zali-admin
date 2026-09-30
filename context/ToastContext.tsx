"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-white/95 border-[#37A970]/30 text-[#0B1C56] shadow-[#37A970]/10'
                : toast.type === 'error'
                ? 'bg-white/95 border-[#DC5355]/30 text-[#0B1C56] shadow-[#DC5355]/10'
                : 'bg-white/95 border-[#340D73]/30 text-[#0B1C56] shadow-[#340D73]/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#37A970] shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#DC5355] shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#340D73] shrink-0" />}
              <p className="text-sm font-semibold tracking-wide">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#768498] hover:text-[#0B1C56] p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
