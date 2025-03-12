import { useGraphStore } from "@/store/useGraphStore";
import { GraphNode } from "@/types/graph";
import React from "react";

interface LegendItem {
  type: string;
  color: string;
}
/**
 * 力导向图图例组件
 * 横向展示节点类型及其对应的颜色
 */
const GraphLegend = () => {
  const graph = useGraphStore();
  const { nodes } = graph;
  // 将配置对象转换为图例项数组
  const config = nodes.reduce(
    (acc, node) => {
      acc[node.type] = node.color;
      return acc;
    },
    {} as Record<string, string>,
  );

  const legendItems: LegendItem[] = Object.entries(config).map(
    ([type, color]) => ({
      type,
      color,
    }),
  );

  return (
    <div className="flex items-center gap-6 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
      {legendItems.map(({ type, color }) => (
        <div key={type} className="flex items-center gap-2">
          {/* 颜色指示器 */}
          <div
            className="h-4 w-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          {/* 类型标签 */}
          <span className="text-sm font-medium text-gray-700">{type}</span>
        </div>
      ))}
    </div>
  );
};

export default GraphLegend;
