import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/common/Toast";
import React from "react";

export const metadata: Metadata = {
  title: "抑郁症专家知识系统",
  description: "专业的抑郁症诊断与治疗知识库，为医疗工作者提供决策支持",
    icons: {
        icon: [
            {
                url: "/favicon.ico",
                sizes: "any",
            },
        ],
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <ToastContainer/>
      </body>
    </html>
  );
}
