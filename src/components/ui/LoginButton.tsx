"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftToLine } from "lucide-react";

/**
 * 按钮样式类名组合
 * 使用 Tailwind 类名组合实现按钮样式
 */
const BUTTON_CLASSES = {
  base: [
    // 基础样式
    "bg-blue-600",
    "text-white",
    "font-semibold",
    "rounded-lg",
    "py-3",
    "px-12",
    "text-xl",
    "mx-auto",

    // Flexbox 布局
    "flex",
    "items-center",
    "justify-center",
    "space-x-2",

    // 交互效果
    "shadow-lg",
    "transform",
    "transition-all",
    "duration-300",

    // 悬停状态
    "hover:bg-blue-700",
    "hover:scale-105",
    "hover:shadow-xl",

    // 焦点状态
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-offset-2",

    // 适配深色模式
    "dark:bg-blue-500",
    "dark:hover:bg-blue-400",
  ].join(" "),
};

/**
 * 登录按钮组件
 *
 * @component
 * @description 一个带有图标的登录按钮，点击后跳转到登录页面
 *
 * @example
 * ```jsx
 * <LoginButton />
 * ```
 */
const LoginButton = () => {
  const router = useRouter();

  /**
   * 处理按钮点击事件
   * @param {React.MouseEvent<HTMLButtonElement>} event - 点击事件对象
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/login");
  };

  return (
    <button
      type="button"
      className={BUTTON_CLASSES.base}
      onClick={handleClick}
      aria-label="进入系统"
    >
      <span>进入系统</span>
      <ArrowLeftToLine className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default LoginButton;
