export enum ResponseCode {
    // 登录相关状态码
    LOGIN_SUCCEED = "10000",
    LOGIN_FAILED = "10001",
    LOGOUT_SUCCEED = "10002",
    LOGOUT_FAILED = "10003",
    LOGIN_ALREADY_DONE = "10004",

    // 注册相关状态码
    REGISTER_SUCCEED = "20000",
    REGISTER_FAILED_USERNAME_EXISTED = "20001",

    // 系统发生错误
    SYSTEM_ERROR = "30001",

    // 未知错误
    UNKNOWN_ERROR = "40001",

    //API 调用相关
    API_SUCCESS = "50001",
    API_FAILED = "50002",
    API_UNAVAILABLE = "50003",
    API_UNAUTHORIZED = "50004",
}