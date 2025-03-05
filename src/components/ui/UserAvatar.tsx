'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from "@/services/UserService";
import { ResponseCode } from "@/constant/ResponseCode";
import { showToast } from '../common/Toast';

/**
 * UserAvatar 组件属性接口定义
 * @property {string} username - 用户名，用于显示头像中的首字母
 */
interface UserAvatarProps {
    username: string;
}

/**
 * UserAvatar 组件 - 显示用户头像并提供下拉菜单功能
 * @param {UserAvatarProps} props - 组件属性
 * @returns {JSX.Element} 渲染的组件
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ username }) => {
    // 控制下拉菜单的显示状态
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    // 创建引用以检测点击事件是否在组件外部
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // 获取路由实例，用于页面导航
    const router = useRouter();
    
    // 添加点击事件监听器，用于检测点击组件外部时关闭下拉菜单
    useEffect(() => {
        /**
         * 处理组件外部点击事件
         * @param {MouseEvent} event - 鼠标事件对象
         */
        const handleClickOutside = (event: MouseEvent) => {
            // 检查点击是否发生在组件外部
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); // 关闭下拉菜单
            }
        };

        // 添加全局点击事件监听器
        document.addEventListener('mousedown', handleClickOutside);
        
        // 组件卸载时移除事件监听器
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * 处理登出操作的函数
     * 1. 调用登出 API
     * 2. 清除本地存储的令牌
     * 3. 根据响应显示提示并重定向到登录页面
     */
    const handleLogout = async (): Promise<void> => {
        try {
            // 无论响应如何，都清除本地存储的令牌
            localStorage.removeItem('tokenName');
            localStorage.removeItem('tokenValue');
            localStorage.removeItem('username');
            
            // 调用登出服务
            const response = await logout();
            // 根据响应代码显示不同提示
            if (response.code === ResponseCode.LOGOUT_SUCCEED) {
                // 登出成功提示
                showToast(
                    response.message,
                    3000,
                    'success',
                    () => router.push('/login')
                );
            } else {
                // 登出失败提示
                showToast(
                    response.message,
                    3000,
                    'error',
                    () => router.push('/login')
                );
            }
        } catch (error) {
            // 捕获并处理可能的异常
            showToast(
                '登出时发生错误',
                3000,
                'error',
                () => router.push('/login')
            );
        }
    };

    /**
     * 处理用户切换功能
     * 与登出功能相同，可在将来扩展为不同功能
     */
    const handleSwitchUser = (): Promise<void> => {
        // 目前复用登出功能，后续可以扩展为不同的实现
        return handleLogout();
    };

    // 获取用户名首字母并转为大写，用于头像显示
    const userInitial = username.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 头像按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-800 text-white
                   hover:bg-blue-700 transition-colors duration-200 focus:outline-none"
                aria-label="用户菜单"
                title={username}
            >
                {userInitial}
            </button>

            {/* 下拉菜单，仅在 isOpen 为 true 时渲染 */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                >
                    {/* 切换用户按钮 */}
                    <button
                        onClick={handleSwitchUser}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        role="menuitem"
                    >
                        切换用户
                    </button>
                    
                    {/* 退出登录按钮 */}
                    <button
                        onClick={handleLogout}
                        className="text-red-500 block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                        role="menuitem"
                    >
                        退出登录
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;