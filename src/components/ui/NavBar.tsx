'use client'

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
    localStorage.removeItem('tokenName');
    localStorage.removeItem('tokenValue');
    localStorage.removeItem('username');
    const response = await logout();
    try {
      if (response.code === ResponseCode.LOGOUT_SUCCEED) {
        showToast(
          response.message,
          3000,
          'success',
          () => router.push('/login')
        )
      } else {
        showToast(
          response.message,
          3000,
          'error',
          () => router.push('/login')
        )
      }
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <nav
      className="bg-blue-600 text-white fixed top-0 left-0 w-full z-50 shadow-lg"
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <ClipboardPlus
              size={36}
              aria-hidden="true"
              className="shrink-0"
            />
            <h1 className="text-2xl sm:text-3xl pt-1 font-semibold whitespace-nowrap">
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
                  className="hover:bg-blue-700 px-2 sm:px-3 py-2 rounded-md text-base sm:text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 退出登录按钮 */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-base sm:text-lg font-semibold hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;