import {
  Disease,
  Symptom,
  Risk,
  Therapy,
  Medication,
} from "@/types/depression";
import { GraphNode, GraphLink } from "@/types/graph";

// 定义实体类型到颜色的映射
const typeColorMap: Record<string, string> = {
  disease: "#FF6B6B", // 红色
  symptom: "#4ECDC4", // 青色
  risk: "#FFA500", // 橙色
  therapy: "#7DCFB6", // 绿色
  medication: "#9D65C9", // 紫色
};

// 类型守卫函数，用于判断实体类型
const isDisease = (entity: any): entity is Disease =>
  "medicalCode" in entity || "diagnosticCriteria" in entity;
const isSymptom = (entity: any): entity is Symptom =>
  "severity" in entity || "isCommon" in entity;
const isRisk = (entity: any): entity is Risk =>
  "impactFactor" in entity || "evidenceLevel" in entity;
const isTherapy = (entity: any): entity is Therapy =>
  "approach" in entity || "durationCourse" in entity;
const isMedication = (entity: any): entity is Medication =>
  "genericName" in entity || "drugClass" in entity;

// 获取实体类型
function getEntityType(entity: any): string {
  if (isDisease(entity)) return "disease";
  if (isSymptom(entity)) return "symptom";
  if (isRisk(entity)) return "risk";
  if (isTherapy(entity)) return "therapy";
  if (isMedication(entity)) return "medication";
  return "unknown";
}

// 生成唯一ID
function generateUniqueId(entity: any, type: string): string {
  return `${type}_${entity.id || entity.name.replace(/\s+/g, "_").toLowerCase()}`;
}

/**
 * 将实体转换为图形节点
 * @param entity 任意实体对象
 * @returns GraphNode 图形节点
 */
export function entityToNode(
  entity: Disease | Symptom | Risk | Therapy | Medication,
): GraphNode {
  const type = getEntityType(entity);

  return {
    id: generateUniqueId(entity, type),
    name: entity.name,
    type,
    color: typeColorMap[type] || "#999999",
    originalData: entity,
  };
}

/**
 * 创建两个实体之间的连接
 * @param sourceEntity 源实体
 * @param targetEntity 目标实体
 * @param linkType 连接类型
 * @param linkText 连接说明文本
 * @returns GraphLink 图形连接
 */
export function createLink(
  sourceEntity: Disease | Symptom | Risk | Therapy | Medication,
  targetEntity: Disease | Symptom | Risk | Therapy | Medication,
  linkType: string,
  linkText: string,
): GraphLink {
  const sourceType = getEntityType(sourceEntity);
  const targetType = getEntityType(targetEntity);

  return {
    source: generateUniqueId(sourceEntity, sourceType),
    target: generateUniqueId(targetEntity, targetType),
    type: linkType,
    text: linkText,
  };
}

/**
 * 从疾病实体生成所有相关节点和链接
 * @param disease 疾病实体
 * @returns 包含所有节点和链接的对象
 */
export function generateGraphFromDisease(disease: Disease): {
  nodes: GraphNode[];
  links: GraphLink[];
} {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 添加疾病节点
  const diseaseNode = entityToNode(disease);
  nodes.push(diseaseNode);

  // 处理症状
  if (disease.symptoms && disease.symptoms.size > 0) {
    disease.symptoms.forEach((symptom) => {
      const symptomNode = entityToNode(symptom);
      nodes.push(symptomNode);

      links.push(createLink(disease, symptom, "has_symptom", "表现为"));
    });
  }

  // 处理风险因素
  if (disease.riskFactors && disease.riskFactors.size > 0) {
    disease.riskFactors.forEach((risk) => {
      const riskNode = entityToNode(risk);
      nodes.push(riskNode);

      links.push(createLink(risk, disease, "increases_risk", "增加风险"));
    });
  }

  // 处理治疗方法
  if (disease.treatments && disease.treatments.size > 0) {
    disease.treatments.forEach((therapy) => {
      const therapyNode = entityToNode(therapy);
      nodes.push(therapyNode);

      links.push(createLink(therapy, disease, "treats", "治疗"));
    });
  }

  // 处理药物
  if (disease.medications && disease.medications.size > 0) {
    disease.medications.forEach((medication) => {
      const medicationNode = entityToNode(medication);
      nodes.push(medicationNode);

      links.push(createLink(medication, disease, "medicates", "用于"));
    });
  }

  // 去除重复节点
  const uniqueNodes = Array.from(
    new Map(nodes.map((node) => [node.id, node])).values(),
  );

  return { nodes: uniqueNodes, links };
}

/**
 * 从多个实体生成完整的图形数据
 * @param entityArrays 包含不同类型实体数组的对象，每个数组包含Disease、Symptom、Risk、Therapy或Medication类型的实体
 * @returns 包含所有节点和链接的对象
 */
export function generateCompleteGraph(
  entityArrays: Array<
    Disease[] | Symptom[] | Risk[] | Therapy[] | Medication[]
  >,
): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  // 遍历所有实体数组
  entityArrays.forEach((entityArray) => {
    // 处理数组中的每个实体
    for (let i = 0; i < entityArray.length; i++) {
      const entity = entityArray[i];
      const node = entityToNode(entity);
      nodesMap.set(node.id, node);

      // 如果是疾病，处理其关联实体
      if (isDisease(entity)) {
        const diseaseGraph = generateGraphFromDisease(entity);

        // 添加所有节点
        diseaseGraph.nodes.forEach((node) => {
          nodesMap.set(node.id, node);
        });

        // 添加所有链接
        links.push(...diseaseGraph.links);
      }
    }
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links,
  };
}
