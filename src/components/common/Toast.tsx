"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
  type?: "info" | "success" | "error";
};

export type ToastType = {
  id: string;
  message: string;
  duration?: number;
  type?: "info" | "success" | "error";
  onCloseCallback?: () => void;
};

// 创建一个全局存储 toast 的容器
let toasts: ToastType[] = [];
let listeners: ((toasts: ToastType[]) => void)[] = [];

// 通知所有监听器
const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

// 添加新的 toast
export const showToast = (
  message: string,
  duration: number = 2500,
  type: "info" | "success" | "error" = "info",
  onCloseCallback?: () => void,
) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, message, duration, type, onCloseCallback });
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
  const toastIndex = toasts.findIndex((toast) => toast.id === id);
  if (toastIndex !== -1) {
    const toast = toasts[toastIndex];
    // 如果有回调函数，则执行回调
    if (toast.onCloseCallback) {
      toast.onCloseCallback();
    }
  }
  toasts = toasts.filter((toast) => toast.id !== id);
  notifyListeners();
};

// 创建 Toast 组件容器以确保 z-index 足够高
let toastContainerElement: HTMLDivElement | null = null;

// 初始化 Toast 容器
const getToastContainer = () => {
  if (!toastContainerElement && typeof document !== "undefined") {
    toastContainerElement = document.createElement("div");
    toastContainerElement.id = "toast-container";
    // 设置最高层级的样式
    toastContainerElement.style.position = "fixed";
    toastContainerElement.style.top = "0";
    toastContainerElement.style.left = "0";
    toastContainerElement.style.width = "100%";
    toastContainerElement.style.height = "0";
    toastContainerElement.style.zIndex = "9999"; // 设置非常高的 z-index
    toastContainerElement.style.pointerEvents = "none"; // 允许点击穿透
    document.body.appendChild(toastContainerElement);
  }
  return toastContainerElement;
};

const Toast: React.FC<ToastProps> = ({ message, onClose, type = "info" }) => {
  // 获取图标组件
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      case "info":
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getToastStyles = () => {
    switch (type) {
      case "error":
        return "bg-white border-l-4 border-l-red-500 text-gray-700";
      case "success":
        return "bg-white border-l-4 border-l-green-500 text-gray-700";
      case "info":
      default:
        return "bg-white border-l-4 border-l-blue-500 text-gray-700";
    }
  };

  return (
    <div
      className="fixed left-1/2 top-6 -translate-x-1/2 transform animate-toast-slide-down"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className={`flex items-center gap-3 rounded-lg px-5 py-4 shadow-lg ${getToastStyles()}`}
      >
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="关闭"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastType[]>([]);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    // 使用专门的 toast 容器而不是 document.body
    setPortalContainer(getToastContainer());

    const listener = (newToasts: ToastType[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <div>
      {currentToasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    portalContainer,
  );
};
