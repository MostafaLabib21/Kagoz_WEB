import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const TOAST_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${TOAST_STYLES[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] animate-slide-in`}
          >
            <span className="flex-1 text-sm">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 hover:opacity-70">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
