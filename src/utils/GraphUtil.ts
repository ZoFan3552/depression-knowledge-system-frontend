import { Depression } from "@/types/knowledge";
import { GraphNode, GraphLink } from "@/types/graph";

// 使用更专业的颜色方案（符合医疗数据可视化最佳实践）
enum NodeColor {
  DEPRESSION = "#2C3E50", // 深蓝灰（更专业的医疗主题色）
  SYMPTOM = "#E74C3C", // 警示红（症状需要突出显示）
  CAUSE = "#3498DB", // 信任蓝（原因类信息）
  DIAGNOSIS = "#27AE60", // 安全绿（诊断相关）
  TREATMENT = "#9B59B6", // 紫色（治疗类常用色）
  PREVENTION = "#F1C40F", // 金黄色（预防警示色）
  MEDICATION = "#E67E22", // 橙色（药物类常用色）
}

// 类型安全的关联配置
type RelationConfig = {
  key: keyof Depression;
  type: GraphNode["type"];
  color: NodeColor;
  relationText: string;
};

const RELATION_CONFIGS: readonly RelationConfig[] = [
  {
    key: "symptoms",
    type: "Symptom",
    color: NodeColor.SYMPTOM,
    relationText: "HAS_SYMPTOM",
  },
  {
    key: "causes",
    type: "Cause",
    color: NodeColor.CAUSE,
    relationText: "HAS_CAUSE",
  },
  {
    key: "diagnoses",
    type: "Diagnosis",
    color: NodeColor.DIAGNOSIS,
    relationText: "HAS_DIAGNOSIS",
  },
  {
    key: "treatments",
    type: "Treatment",
    color: NodeColor.TREATMENT,
    relationText: "HAS_TREATMENT",
  },
  {
    key: "preventions",
    type: "Prevention",
    color: NodeColor.PREVENTION,
    relationText: "HAS_PREVENTION",
  },
  {
    key: "medications",
    type: "Medication",
    color: NodeColor.MEDICATION,
    relationText: "HAS_MEDICATION",
  },
] as const;

export function convertDepressionArrayToGraph(depressions: Depression[]): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const existingNodeIds = new Set<string>();

  const addNode = (node: GraphNode) => {
    const stringId = node.id;
    if (!existingNodeIds.has(stringId)) {
      nodes.push({ ...node, id: stringId });
      existingNodeIds.add(stringId);
    }
  };

  depressions.forEach((depression) => {
    addNode({
      id: depression.name,
      type: "Depression",
      color: NodeColor.DEPRESSION,
    });

    RELATION_CONFIGS.forEach(({ key, type, color, relationText }) => {
      const items = Array.from(depression[key] as Iterable<{ name: string }>);
      items.forEach((item) => {
        addNode({
          id: item.name,
          type,
          color,
        });

        links.push({
          source: depression.name,
          target: item.name,
          text: relationText,
        });
      });
    });
  });

  return { nodes, links };
}

// 使用泛型增强类型安全
export function changeNodeColor<T extends GraphNode>(
  nodeType: string,
  newColor: string,
  nodes: T[],
): T[] {
  return nodes.map((node) =>
    node.type === nodeType ? { ...node, color: newColor } : node,
  );
}

// 使用Set特性优化去重
export function getNodesTypes(nodes: GraphNode[]): string[] {
  return [...new Set(nodes.map((node) => node.type))];
}

// 优化颜色获取逻辑
export function getNodesColors(nodes: GraphNode[]): string[] {
  const colorMap = new Map(nodes.map((node) => [node.color, true]));
  return Array.from(colorMap.keys());
}
