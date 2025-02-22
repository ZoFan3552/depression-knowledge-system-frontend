import React from 'react';

/**
 * 图例项的类型定义
 * @interface LegendItem
 * @property {string} type - 节点类型
 * @property {string} color - 节点颜色
 */
interface LegendItem {
  type: string;
  color: string;
}

/**
 * 图例组件的属性接口
 * @interface LegendProps
 * @property {Record<string, string>} nodeColorConfig - 节点类型到颜色的映射
 */
interface LegendProps {
  nodeColorConfig: Record<string, string>;
}

/**
 * 力导向图图例组件
 * 横向展示节点类型及其对应的颜色
 */
const GraphLegend: React.FC<LegendProps> = ({ nodeColorConfig }) => {
  // 将配置对象转换为图例项数组
  const legendItems: LegendItem[] = Object.entries(nodeColorConfig).map(([type, color]) => ({
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