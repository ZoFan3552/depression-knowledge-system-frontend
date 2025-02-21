import React from "react";

// 定义类型，约束 nodeColors 结构
interface LegendProps {
  nodeColors: Record<string, string>; // 结点类型 -> 颜色
}

// 图例组件：渲染不同类型的结点颜色
const Legend: React.FC<LegendProps> = ({ nodeColors }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-2">图例</h3>
      <ul>
        {Object.entries(nodeColors).map(([type, color]) => (
          <li key={type} className="flex items-center space-x-2">
            {/* 颜色块 */}
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            {/* 结点类型 */}
            <span className="text-sm">{type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
