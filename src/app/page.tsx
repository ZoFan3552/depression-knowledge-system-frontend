import React from 'react';
import LoginButton from '../components/ui/LoginButton';

const Home = () => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-auto px-4">
        {/* 主要内容区域 */}
        <div className="text-center space-y-8">
          {/* Logo和标题区域 */}
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-blue-800 tracking-tight">
              抑郁症专家知识系统
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专业的抑郁症诊断与治疗知识库，为医疗工作者提供决策支持
            </p>
          </div>

          {/* 登录按钮区域 */}
          <div>
            <LoginButton />
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
