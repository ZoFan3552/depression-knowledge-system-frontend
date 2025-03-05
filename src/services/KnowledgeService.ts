import { Depression } from "@/types/Knowledge";
import { ApiResponse } from "@/types/Response";
import { postRequest } from "../utils/RequestUtil";
const API_BASE_URL = 'http://localhost:8080/knowledge';

export const getAllDepressions = async (): Promise<ApiResponse<Depression[]>> => {
    return postRequest<Depression[]>(
        API_BASE_URL,
        '/get-all-depressions',
        {},
        {}
    );
};