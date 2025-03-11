"use client";

import React from "react";
import Link from "next/link";
import { ClipboardPlus } from "lucide-react";
import { ResponseCode } from "@/constant/ResponseCode";
import { logout } from "@/services/UserService";
import { useRouter } from "next/navigation";
import { showToast } from "../common/Toast";

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
 * 导航栏组件
 * @description 页面顶部的主导航栏，包含logo、标题和导航链接
 *
 * @example
 * ```tsx
 * <NavBar />
 * ```
 */
const NavBar: React.FC = () => {
  const router = useRouter();
  const handleLogout = async () => {
    localStorage.removeItem("tokenName");
    localStorage.removeItem("tokenValue");
    localStorage.removeItem("username");
    const response = await logout();
    try {
      if (response.code === ResponseCode.LOGOUT_SUCCEED) {
        showToast(response.message, 3000, "success", () =>
          router.push("/login"),
        );
      } else {
        showToast(response.message, 3000, "error", () => router.push("/login"));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav
      className="fixed left-0 top-0 z-50 w-full bg-blue-600 text-white shadow-lg"
      role="navigation"
      aria-label="主导航"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <ClipboardPlus size={36} aria-hidden="true" className="shrink-0" />
            <h1 className="whitespace-nowrap pt-1 text-2xl font-semibold sm:text-3xl">
              抑郁症专家知识系统
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {/* 导航链接 */}
            <div className="flex space-x-1 sm:space-x-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  passHref
                  className="rounded-md px-2 py-2 text-base font-semibold transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:px-3 sm:text-lg"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 退出登录按钮 */}
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-base font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 sm:text-lg"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
