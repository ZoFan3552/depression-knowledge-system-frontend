import React from "react";

const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white fixed top-0 left-0 w-full z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        {/* 图标 */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-clipboard2-pulse" viewBox="0 0 16 16">
                            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                            <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                            <path d="M9.979 5.356a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.926-.08L4.69 10H4.5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 .447-.276l.936-1.873 1.138 3.793a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h.5a.5.5 0 0 0 0-1h-.128z" />
                        </svg>
                        {/* 标题 */}
                        <h1 className="text-3xl pt-1 font-semibold">抑郁症专家知识系统</h1>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/graph" className="hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">
                            知识图谱
                        </a>
                        <a href="/qa-system" className="hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">
                            知识问答
                        </a>
                        <a href="/management" className="hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">
                            知识管理
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;