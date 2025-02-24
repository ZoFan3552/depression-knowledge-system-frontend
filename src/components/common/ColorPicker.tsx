import React, { useState, useCallback } from 'react';
import { GithubPicker, ColorResult } from 'react-color';

/**
 * 预定义的颜色选项
 * 包含常用的网络图配色方案
 */
const PREDEFINED_COLORS = [
  // 基础色系
  '#B80000', // 深红
  '#DB3E00', // 红橙
  '#FF6F61', // 珊瑚红 
  '#FFA500', // 橙色 

  // 黄色系
  '#FCCB00', // 明黄
  '#FFD700', // 金色 

  // 绿色系
  '#008B02', // 深绿
  '#7CFC00', // 草坪绿 
  '#98FB98', // 薄荷绿 
  '#3CB371', // 海洋绿 

  // 蓝色系
  '#006B76', // 青蓝
  '#1273DE', // 亮蓝
  '#004DCF', // 深蓝
  '#87CEEB', // 天蓝 
  '#4169E1', // 皇家蓝 

  // 紫色系
  '#5300EB', // 深紫
  '#DA70D6', // 兰花紫 
  '#EE82EE', // 浅紫 

  // 中性色
  '#373737', // 深灰
  '#7B7B7B', // 浅灰
  '#D3D3D3', // 淡灰 

  // 特殊色
  '#FF69B4', // 粉红 
  '#FF1493'  // 深粉 
];

interface ColorPickerProps {
  setCurrentColor: (value: string) => void;
  defaultColor?: string;
  title?: string;
  colors?: string[];
}

/**
 * 颜色选择器组件
 * 基于 react-color 的 GithubPicker 实现，提供预设颜色选项和颜色预览功能
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  setCurrentColor,
  defaultColor = '#ff0000',
  title = '选择节点颜色',
  colors = PREDEFINED_COLORS
}) => {
  // 选中颜色的状态管理
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  /**
   * 处理颜色改变事件
   * 更新内部状态并触发外部回调
   */
  const handleChangeComplete = useCallback((color: ColorResult) => {
    const newColor = color.hex;
    setSelectedColor(newColor);
    setCurrentColor(newColor);
  }, [setCurrentColor]);

  /**
   * 渲染颜色预览块
   */
  const ColorPreview = () => (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: selectedColor }}
        title={selectedColor}
        aria-label={`当前选中的颜色：${selectedColor}`}
      />
      <span className="text-sm text-gray-600 font-mono">
        {selectedColor.toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>

      <div className="relative group">
        <GithubPicker
          color={selectedColor}
          onChangeComplete={handleChangeComplete}
          colors={colors}
          className="shadow-lg !bg-white"
          triangle="hide"
        />

        {/* 添加容器投影和圆角 */}
        <div className="absolute inset-0 -m-1 rounded-lg bg-gray-50 -z-10" />
      </div>

      <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
        <ColorPreview />
      </div>
    </div>
  );
};

export default ColorPicker;