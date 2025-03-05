'use client'

import { showToast } from "@/components/common/Toast";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

//请求相关配置接口
interface ApiResponse<T> {
    code: string;
    message: string;
    data: T | null;
    timestamp: Date;
}

interface RequestState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    success: boolean;
}
interface RequestResult<T> extends RequestState<T> {
    execute: (config?: AxiosRequestConfig) => Promise<ApiResponse<T> | undefined>;
    reset: () => void;
    cancel: (reason?: string) => void;
    clearCache: () => void;
}

//缓存相关配置接口
interface CacheConfig {
    enabled: boolean;
    maxAge: number;// 过期时间（毫秒）
    key?: string;// 自定义 keyi
}
interface CacheItem<T> {
    data: ApiResponse<T>;
    timestamp: number;
}

const apiCache: Record<string, CacheItem<any>> = {};


export function useApiRequest<T>(
    url: string,
    method: string = 'GET',
    initialData: T | null = null,
    immediate: boolean = false,
    defaultConfig: AxiosRequestConfig = {},
    cacheConfig: CacheConfig = { enabled: false, maxAge: 5 * 60 * 1000 }
): RequestResult<T> {
    const [state, setState] = useState<RequestState<T>>({
        data: initialData,
        loading: immediate,
        error: null,
        success: false
    });

    //取消令牌引用
    const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

    //组件是否还在挂载
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        isMountedRef.current = false;
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel('组件已卸载')
        }
    }, []);


    // 生成缓存键
    const getCacheKey = useCallback(
        (config: AxiosRequestConfig = {}): string => {
            if (cacheConfig.key) return cacheConfig.key;

            const params = { ...defaultConfig.params, ...config.params };
            const data = { ...defaultConfig.data, ...config.data };

            return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
        },
        [url, method, defaultConfig, cacheConfig]
    );

    // 检查缓存
    const checkCache = useCallback(
        (cacheKey: string): ApiResponse<T> | null => {
            if (!cacheConfig.enabled || method !== 'GET') return null;

            const cachedItem = apiCache[cacheKey] as CacheItem<T> | undefined;
            if (!cachedItem) return null;

            const now = Date.now();
            if (now - cachedItem.timestamp > cacheConfig.maxAge) {
                delete apiCache[cacheKey];
                return null;
            }

            return cachedItem.data;
        },
        [method, cacheConfig]
    );

    // 更新缓存
    const updateCache = useCallback(
        (cacheKey: string, data: ApiResponse<T>): void => {
            if (!cacheConfig.enabled || method !== 'GET') return;

            apiCache[cacheKey] = {
                data,
                timestamp: Date.now(),
            };
        },
        [method, cacheConfig]
    );


    // 清除缓存
    const clearCache = useCallback(
        (specificKey?: string): void => {
            if (specificKey) {
                delete apiCache[specificKey];
            } else {
                // 清除与当前 URL 相关的所有缓存
                const prefix = `${method}:${url}`;
                Object.keys(apiCache).forEach(key => {
                    if (key.startsWith(prefix)) {
                        delete apiCache[key];
                    }
                });
            }
        },
        [url, method]
    );

    // 取消请求
    const cancel = useCallback(
        (reason: string = '用户取消请求'): void => {
            if (cancelTokenSourceRef.current) {
                cancelTokenSourceRef.current.cancel(reason);
                cancelTokenSourceRef.current = null;
            }
        },
        []
    );

    //重置状态函数
    const reset = useCallback(() => {
        setState({
            data: initialData,
            loading: false,
            error: null,
            success: false
        })
    }, [initialData, cancel]);

    //执行请求函数
    const execute = useCallback(
        async (config: AxiosRequestConfig = {}): Promise<ApiResponse<T> | undefined> => {
            // 如果已有请求正在进行，先取消
            cancel();

            // 创建新的取消令牌
            cancelTokenSourceRef.current = axios.CancelToken.source();

            // 生成缓存键
            const cacheKey = getCacheKey(config);

            // 检查缓存
            const cachedData = checkCache(cacheKey);
            if (cachedData) {
                if (isMountedRef.current) {
                    setState({
                        data: cachedData.data,
                        loading: false,
                        error: null,
                        success: true,
                    });
                }
                return cachedData;
            }

            try {
                // 更新加载状态
                if (isMountedRef.current) {
                    setState(prev => ({ ...prev, loading: true, error: null }));
                }

                // 合并配置并添加取消令牌
                const mergedConfig: AxiosRequestConfig = {
                    ...defaultConfig,
                    ...config,
                    url,
                    method,
                    cancelToken: cancelTokenSourceRef.current.token,
                };

                // 发送请求
                const response: AxiosResponse<ApiResponse<T>> = await axios(mergedConfig);

                // 转换时间戳为 Date 对象
                if (typeof response.data.timestamp === 'string') {
                    response.data.timestamp = new Date(response.data.timestamp);
                }

                // 更新缓存
                updateCache(cacheKey, response.data);

                // 更新状态
                if (isMountedRef.current) {
                    setState({
                        data: response.data.data,
                        loading: false,
                        error: null,
                        success: true,
                    });
                    showToast(response.data.message, 3000);
                }

                return response.data;
            } catch (error) {
                // 如果是取消错误，不进行任何处理
                if (axios.isCancel(error)) {
                    return;
                }

                // 处理错误
                const axiosError = error as AxiosError;
                const errorMessage = axiosError.message || '未知错误';

                if (isMountedRef.current) {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        error: new Error(errorMessage),
                        success: false,
                    }));
                    showToast(errorMessage, 3000, 'error');
                }
            }
        },
        [url, method, defaultConfig, getCacheKey, checkCache, updateCache, cancel]
    );

    // 如果需要立即执行
    useEffect(() => {
        if (immediate) {
            execute();
        }

        // 组件卸载时取消请求
        return () => {
            cancel();
        };
    }, [immediate, execute, cancel]);

    return {
        ...state,
        execute,
        reset,
        cancel,
        clearCache,
    };
}

