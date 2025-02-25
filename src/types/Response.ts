export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T | null;
    timestamp: Date;
}