"use client";

import React, { useState, useEffect } from "react"; // 添加useEffect用于组件生命周期管理
import { useRouter } from "next/navigation"; // 用于页面导航
import { login } from "@/services/userService"; // 导入登录服务
import { ResponseCode } from "@/constant/responseCode"; // 导入响应码常量
import { showToast } from "@/components/common/Toast"; // 导入提示组件
import { z } from "zod";

/**
 * 登录页面组件
 * 提供用户登录功能界面，包含用户名/邮箱和密码输入框
 */
const LoginPage = () => {
  // 使用Next.js路由
  const router = useRouter();

  // 表单数据状态
  const [formData, setFormData] = useState({
    username: "", // 用户名或邮箱
    password: "", // 用户密码
  });

  // 错误信息状态
  const [error, setError] = useState("");

  // 表单提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    // 从localStorage检查是否已有token
    const tokenValue = localStorage.getItem("tokenValue");
    if (tokenValue) {
      // 已登录则跳转到图表页面
      router.push("/graph");
    }
  }, [router]); // 依赖于router

  /**
   * 处理输入框内容变化
   * @param {React.ChangeEvent<HTMLInputElement>} e - 输入框事件对象
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 更新表单数据
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(), // 去除输入内容的首尾空格
    }));
    // 清除错误信息
    setError("");
  };

  const validateForm = () => {
    // 验证用户名是否为空
    if (!formData.username) {
      setError("请输入用户名或邮箱");
      return false;
    }

    // 验证密码是否为空
    if (!formData.password) {
      setError("请输入密码");
      return false;
    }

    return true;
  };

  /**
   * 处理表单提交
   * @param {React.FormEvent} e - 表单提交事件对象
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 清除错误信息
    setError("");

    // 如果已经在提交中，不再处理
    if (isSubmitting) return;

    // 验证表单
    if (!validateForm()) return;

    try {
      // 设置提交状态
      setIsSubmitting(true);

      // 调用登录API
      const response = await login(formData.username, formData.password);

      // 根据响应码处理不同情况
      if (response.code === ResponseCode.LOGIN_SUCCEED) {
        // 登录成功，保存用户信息和token到localStorage
        localStorage.setItem("username", formData.username);
        const data = response.data;
        const tokenSchema = z.object({
          tokenName: z.string(),
          tokenValue: z.string(),
        });
        try {
          const result = tokenSchema.safeParse(data);
          if (result.success) {
            localStorage.setItem("tokenName", result.data.tokenName);
            localStorage.setItem("tokenValue", result.data.tokenValue);
          } else {
            console.error("Invalid token data received", result.error);
          }
        } catch (error) {
          console.error("Failed to store token in sessionStorage", error);
        }
        // 显示成功提示并跳转
        showToast(response.message, 3000, "success", () =>
          router.push("/graph"),
        );
      } else if (response.code === ResponseCode.LOGIN_ALREADY_DONE) {
        // 用户已登录，显示提示并跳转
        showToast(response.message, 3000, "error", () => router.push("/graph"));
      } else {
        // 其他错误情况，显示错误提示
        showToast(response.message, 3000, "error");
        // 设置错误信息
        setError(response.message || "登录失败，请稍后重试");
      }
    } catch (err) {
      // 捕获并处理异常
      console.error("登录过程中发生错误:", err);
      setError("登录服务暂时不可用，请稍后重试");
    } finally {
      // 无论成功与否，重置提交状态
      setIsSubmitting(false);
    }
  };

  /**
   * 处理导航按钮点击
   * @param {string} path - 导航路径
   */
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // 返回登录页面JSX结构
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4">
      {/* 登录容器 */}
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        {/* 标题区域 */}
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold text-blue-800">欢迎登录</h2>
          <p className="text-gray-600">抑郁症专家知识系统</p>
        </div>

        {/* 登录表单 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* 用户名/邮箱输入框 */}
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                用户名 / 邮箱
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入用户名或邮箱"
              />
            </div>

            {/* 密码输入框 */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
              />
            </div>
          </div>

          {/* 错误信息显示 */}
          {error && (
            <div className="text-center text-sm text-red-500" role="alert">
              {error}
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white ${isSubmitting ? "cursor-not-allowed opacity-70" : "transform transition-all duration-150 hover:scale-[1.02] hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? "登录中..." : "登录"}
          </button>

          {/* 其他导航选项 */}
          <div className="flex items-center justify-between text-sm">
            {/* 返回首页按钮 */}
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              返回首页
            </button>

            {/* 忘记密码和注册账号按钮 */}
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => handleNavigate("/forgot-password")}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                忘记密码？
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/register")}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                注册账号
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// 导出登录页面组件
export default LoginPage;
