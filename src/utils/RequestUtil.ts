import { showToast } from "@/components/common/Toast";
import { ApiResponse } from "@/types/response";
import axios, { AxiosRequestConfig } from "axios";

// 抽取公共的 POST 请求逻辑
export async function postRequest<T>(
  baseURL: string,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const apiClient = axios.create({
    baseURL: baseURL,
  });
  let tokenName = localStorage.getItem("tokenName");
  tokenName = tokenName ? tokenName : "NULL";
  let tokenValue = localStorage.getItem("tokenValue");
  tokenValue = tokenValue ? tokenValue : "NULL";
  const newConfig = {
    ...config,
    headers: {
      [tokenName]: tokenValue,
    },
  };
  try {
    const response = await apiClient.post(url, data, newConfig);
    return response.data;
  } catch (error) {
    console.error(`请求 ${url} 时出错:`, error);
    showToast("请求出错", 3000, "error");
    throw error;
  }
}
