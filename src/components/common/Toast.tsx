'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export type ToastType = {
  id: string;
  message: string;
  duration?: number;
};

// 创建一个全局存储 toast 的容器
let toasts: ToastType[] = [];
let listeners: ((toasts: ToastType[]) => void)[] = [];

// 通知所有监听器
const notifyListeners = () => {
  listeners.forEach(listener => listener([...toasts]));
};

// 添加新的 toast
export const showToast = (message: string, duration: number = 3000) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, message, duration });
  notifyListeners();

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
};

// 移除指定 toast
export const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-toast-slide-down">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg px-6 py-3 flex items-center gap-4">
        <span className="text-blue-700">{message}</span>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastType[]>([]);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
    const listener = (newToasts: ToastType[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <div className="relative">
      {currentToasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    portalContainer
  );
};