import { Depression } from "@/types/knowledge";
import { ApiResponse } from "@/types/response";
import { postRequest } from "@/utils/requestUtil";

const API_BASE_URL = "http://localhost:8080/knowledge";

export const getAllDepressions = async (): Promise<
  ApiResponse<Depression[]>
> => {
  return postRequest<Depression[]>(
    API_BASE_URL,
    "/get-all-depressions",
    {},
    {},
  );
};
