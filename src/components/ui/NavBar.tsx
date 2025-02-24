import React from "react";
import Link from "next/link";
import { ClipboardPlus } from "lucide-react";

/**
 * 导航项接口定义
 */
interface NavItem {
  label: string;
  href: string;
}

/**
 * 导航项配置
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: "知识图谱",
    href: "/graph",
  },
  {
    label: "知识问答",
    href: "/qa-system",
  },
  {
    label: "知识管理",
    href: "/management",
  },
];

/**
 * 样式常量
 */
const STYLES = {
  nav: [
    "bg-blue-600",
    "text-white",
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "z-50",
    "shadow-lg",
  ].join(" "),

  container: [
    "max-w-7xl",
    "mx-auto",
    "px-4",
    "sm:px-6",
    "lg:px-8",
  ].join(" "),

  wrapper: [
    "flex",
    "justify-between",
    "items-center",
    "h-16",
  ].join(" "),

  logoSection: [
    "flex",
    "items-center",
    "space-x-4",
  ].join(" "),

  title: [
    "text-2xl",
    "sm:text-3xl",
    "pt-1",
    "font-semibold",
    "whitespace-nowrap",
  ].join(" "),

  navLinks: [
    "flex",
    "space-x-2",
    "sm:space-x-4",
  ].join(" "),

  navItem: [
    "hover:bg-blue-700",
    "px-2",
    "sm:px-3",
    "py-2",
    "rounded-md",
    "text-base",
    "sm:text-lg",
    "font-semibold",
    "transition-colors",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-white",
    "focus:ring-offset-2",
    "focus:ring-offset-blue-600",
  ].join(" "),
};

/**
 * 导航栏组件
 * @description 页面顶部的主导航栏，包含logo、标题和导航链接
 * 
 * @example
 * ```tsx
 * <NavBar />
 * ```
 */
const NavBar: React.FC = () => {
  return (
    <nav className={STYLES.nav} role="navigation" aria-label="主导航">
      <div className={STYLES.container}>
        <div className={STYLES.wrapper}>
          {/* Logo区域 */}
          <div className={STYLES.logoSection}>
            <ClipboardPlus
              size={36}
              aria-hidden="true"
              className="shrink-0"
            />
            <h1 className={STYLES.title}>
              抑郁症专家知识系统
            </h1>
          </div>

          {/* 导航链接 */}
          <div className={STYLES.navLinks}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                passHref
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
