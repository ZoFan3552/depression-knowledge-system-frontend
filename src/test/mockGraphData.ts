import {
  Cause,
  Diagnosis,
  Depression,
  Medication,
  Prevention,
  Symptom,
  Treatment,
} from "@/types/knowledge";

// 症状数据
const symptoms: Symptom[] = [
  { name: "持续的悲伤或空虚感" },
  { name: "失眠或睡眠过多" },
  { name: "食欲改变" },
  { name: "注意力难以集中" },
  { name: "疲劳或能量缺乏" },
  { name: "无价值感或过度内疚" },
  { name: "反复想到死亡或自杀" },
];

// 病因数据
const causes: Cause[] = [
  { name: "遗传因素" },
  { name: "神经递质失衡" },
  { name: "心理社会压力" },
  { name: "重大生活变故" },
  { name: "慢性疾病" },
];

// 诊断方法
const diagnoses: Diagnosis[] = [
  { name: "临床会谈评估" },
  { name: "心理量表测评" },
  { name: "精神状态检查" },
  { name: "排除器质性疾病" },
];

// 预防措施
const preventions: Prevention[] = [
  { name: "保持规律的作息时间" },
  { name: "建立健康的社交关系" },
  { name: "适度运动" },
  { name: "学习压力管理技巧" },
  { name: "保持工作与生活平衡" },
];

// 治疗方案
const treatments: Treatment[] = [
  { name: "药物治疗" },
  { name: "心理治疗" },
  { name: "认知行为治疗" },
  { name: "人际关系治疗" },
  { name: "电疗(严重案例)" },
];

// 药物
const medications: Medication[] = [
  { name: "选择性五羟色胺再摄取抑制剂(SSRIs)" },
  { name: "五羟色胺和去甲肾上腺素再摄取抑制剂(SNRIs)" },
  { name: "三环类抗抑郁药" },
  { name: "非典型抗抑郁药" },
];

// 疾病数据
export const mockDepressions: Depression[] = [
  {
    name: "轻度抑郁症",
    symptoms: new Set([
      symptoms[0], // 持续的悲伤或空虚感
      symptoms[1], // 失眠或睡眠过多
      symptoms[2], // 食欲改变
      symptoms[4], // 疲劳或能量缺乏
    ]),
    causes: new Set([
      causes[2], // 心理社会压力
      causes[3], // 重大生活变故
    ]),
    diagnoses: new Set([
      diagnoses[0], // 临床会谈评估
      diagnoses[1], // 心理量表测评
      diagnoses[2], // 精神状态检查
    ]),
    preventions: new Set([
      preventions[0], // 规律作息
      preventions[1], // 健康社交
      preventions[2], // 适度运动
      preventions[3], // 压力管理
    ]),
    treatments: new Set([
      treatments[1], // 心理治疗
      treatments[2], // 认知行为治疗
      treatments[3], // 人际关系治疗
    ]),
    medications: new Set([
      medications[0], // SSRIs
      medications[3], // 非典型抗抑郁药
    ]),
  },
  {
    name: "重度抑郁症",
    symptoms: new Set([
      symptoms[0], // 持续的悲伤或空虚感
      symptoms[1], // 失眠或睡眠过多
      symptoms[4], // 疲劳或能量缺乏
      symptoms[5], // 无价值感或过度内疚
      symptoms[6], // 反复想到死亡或自杀
    ]),
    causes: new Set([
      causes[0], // 遗传因素
      causes[1], // 神经递质失衡
      causes[2], // 心理社会压力
      causes[4], // 慢性疾病
    ]),
    diagnoses: new Set([
      diagnoses[0], // 临床会谈评估
      diagnoses[1], // 心理量表测评
      diagnoses[2], // 精神状态检查
      diagnoses[3], // 排除器质性疾病
    ]),
    preventions: new Set([
      preventions[0], // 规律作息
      preventions[1], // 健康社交
      preventions[2], // 适度运动
      preventions[3], // 压力管理
      preventions[4], // 工作生活平衡
    ]),
    treatments: new Set([
      treatments[0], // 药物治疗
      treatments[1], // 心理治疗
      treatments[2], // 认知行为治疗
      treatments[4], // 电疗
    ]),
    medications: new Set([
      medications[0], // SSRIs
      medications[1], // SNRIs
      medications[2], // 三环类抗抑郁药
    ]),
  },
];
