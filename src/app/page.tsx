import React from "react";
import LoginButton from "../components/ui/LoginButton";

const Home = () => {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="relative mx-auto w-full max-w-4xl px-4">
        {/* 主要内容区域 */}
        <div className="space-y-8 text-center">
          {/* Logo和标题区域 */}
          <div className="animate-fade-in space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-blue-800">
              抑郁症评估专家知识系统
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              专业的抑郁症诊断与治疗知识库，为医疗工作者提供决策支持
            </p>
          </div>

          {/* 登录按钮区域 */}
          <div>
            <LoginButton />
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-blob absolute left-10 top-1/4 h-64 w-64 rounded-full bg-blue-100 opacity-70 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute right-10 top-1/3 h-64 w-64 rounded-full bg-blue-200 opacity-70 mix-blend-multiply blur-xl filter"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
