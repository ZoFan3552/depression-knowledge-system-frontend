'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/UserService';
import { ResponseCode } from "@/constant/ResponseCode";
import { User } from '@/types/User';
import { showToast } from '@/components/common/Toast';

/**
 * 注册表单数据接口定义
 */
interface FormData {
    username: string;   // 用户名
    email: string;      // 邮箱地址
    password: string;   // 密码
    confirmPassword: string;  // 确认密码
}

/**
 * 注册页面组件
 * 处理用户注册流程，包括表单验证和提交
 */
const RegisterPage = () => {
    // 初始化路由器，用于页面跳转
    const router = useRouter();

    // 初始化表单数据状态
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // 初始化待注册用户数据状态
    const [registerUser, setRegisterUser] = useState<User>({
        username: '',
        email: '',
        password: '',
    });

    // 错误信息状态
    const [error, setError] = useState('');

    // 提交按钮禁用状态
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * 处理表单输入变化
     * @param e - 输入事件对象
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // 更新表单数据状态
        setFormData(prev => ({
            ...prev,
            [name]: value.trim() // 去除输入值的首尾空格
        }));
        // 清除错误信息
        setError('');
    };

    /**
     * 表单验证函数
     * @returns {boolean} - 表单是否有效
     */
    const validateForm = (): boolean => {
        // 检查所有必填项是否填写
        if (!formData.username.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
            setError('请填写所有必填项');
            return false;
        }

        // 验证用户名长度
        if (formData.username.trim().length < 3) {
            setError('用户名长度至少为3个字符');
            return false;
        }

        // 验证两次输入的密码是否一致
        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            return false;
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError('请输入有效的邮箱地址');
            return false;
        }

        // 验证密码强度
        // 密码长度至少8位
        if (formData.password.length < 8) {
            setError('密码长度至少为8个字符');
            return false;
        }

        // 密码必须包含大写字母、小写字母和数字
        const hasUpperCase = /[A-Z]/.test(formData.password);
        const hasLowerCase = /[a-z]/.test(formData.password);
        const hasNumber = /\d/.test(formData.password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            setError('密码必须同时包含大写字母、小写字母和数字');
            return false;
        }

        // 所有验证通过
        return true;
    };

    /**
     * 处理表单提交
     * @param e - 表单提交事件对象
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // 阻止表单默认提交行为
        setError('');        // 清除错误信息

        // 防止重复提交
        if (isSubmitting) {
            return;
        }

        // 验证表单
        if (!validateForm()) {
            return;
        }

        // 设置提交状态为true
        setIsSubmitting(true);

        // 构建注册用户对象
        const newUser: User = {
            username: formData.username.trim(),  // 确保去除首尾空格
            password: formData.password,         // 使用密码而非确认密码
            email: formData.email.trim()         // 确保去除首尾空格
        }
        setRegisterUser(newUser);

        try {
            // 调用注册服务
            const response = await register(newUser);

            // 处理注册响应
            if (response.code === ResponseCode.REGISTER_SUCCEED) {
                // 注册成功，显示提示并跳转到登录页
                showToast(
                    response.message,
                    3000,
                    'success',
                    () => router.push('/login')
                );
            } else {
                // 注册失败，显示错误信息
                setError(response.message);
            }
        } catch (err) {
            // 捕获并处理异常
            setError('注册失败：' + (err instanceof Error ? err.message : '未知错误'));
        } finally {
            // 无论成功失败，重置提交状态
            setIsSubmitting(false);
        }
    };

    // 组件卸载时清理工作
    useEffect(() => {
        return () => {
            // 在组件卸载时重置状态，防止内存泄漏
            setIsSubmitting(false);
        };
    }, []);

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* 标题区域 */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-800 mb-2">注册账号</h2>
                    <p className="text-gray-600">加入抑郁症专家知识系统</p>
                </div>

                {/* 注册表单 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* 用户名输入框 */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                用户名
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300
                         placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="请输入用户名"
                            />
                        </div>

                        {/* 邮箱输入框 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                邮箱
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300
                         placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="请输入邮箱"
                            />
                        </div>

                        {/* 密码输入框 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                密码
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300
                         placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="请输入密码（至少6个字符）"
                            />
                        </div>

                        {/* 确认密码输入框 */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                确认密码
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300
                         placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="请再次输入密码"
                            />
                        </div>
                    </div>

                    {/* 错误信息显示 */}
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* 注册按钮 */}
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent
                     text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transform transition-all duration-150 hover:scale-[1.02]"
                    >
                        注册
                    </button>
                    {/* 返回登录 */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            已有账号？返回登录
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
