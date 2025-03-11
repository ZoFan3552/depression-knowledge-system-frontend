import { ApiResponse } from "@/types/response";
import { User } from "@/types/user";
import { postRequest } from "@/utils/requestUtil";

const API_BASE_URL = "http://localhost:8080/user";

// 登录接口，需附带 token 请求头
export const login = async (
  username: string,
  password: string,
): Promise<ApiResponse<unknown>> => {
  return postRequest<unknown>(
    API_BASE_URL,
    "/login",
    { username, password },
    {},
  );
};

// 注册接口，不需要 token 请求头
export const register = async (user: User): Promise<ApiResponse<string>> => {
  return postRequest<string>(API_BASE_URL, "/register", user, {});
};

// 登出接口，需附带 token 请求头
export const logout = async (): Promise<ApiResponse<string>> => {
  return postRequest<string>(API_BASE_URL, "/logout", {}, {});
};
