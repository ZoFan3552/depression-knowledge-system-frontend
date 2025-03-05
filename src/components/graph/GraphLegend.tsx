import { GraphNode } from '@/types/Graph';
import React from 'react';

interface LegendItem {
  type: string;
  color: string;
}

interface LegendProps {
  nodes: GraphNode[];
}

/**
 * 力导向图图例组件
 * 横向展示节点类型及其对应的颜色
 */
const GraphLegend: React.FC<LegendProps> = ({ nodes }) => {
  // 将配置对象转换为图例项数组
  const config = nodes.reduce((acc, node) => {
    acc[node.type] = node.color;
    return acc;
  }, {} as Record<string, string>);

  const legendItems: LegendItem[] = Object.entries(config).map(([type, color]) => ({
    type,
    color
  }));

  return (
    <div className="bg-white/90 backdrop-blur-sm 
                    rounded-lg shadow-lg p-3 flex items-center gap-6">
      {legendItems.map(({ type, color }) => (
        <div key={type} className="flex items-center gap-2">
          {/* 颜色指示器 */}
          <div
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          {/* 类型标签 */}
          <span className="text-sm font-medium text-gray-700">
            {type}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GraphLegend;