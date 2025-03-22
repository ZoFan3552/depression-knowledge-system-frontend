export interface Disease {
  id?: number; // 主键，可选
  name: string; // 实体名称
  description?: string; // 实体描述
  createTime?: string; // 创建时间（ISO 格式字符串）
  updateTime?: string; // 更新时间
  medicalCode?: string; // 医学编码
  category?: string; // 疾病分类
  synonyms?: string; // 同义词
  prevalenceRate?: number; // 患病率
  diagnosticCriteria?: string; // 诊断标准

  // 关联实体（请确保这些类型也被定义）
  symptoms?: Set<Symptom>;
  riskFactors?: Set<Risk>;
  treatments?: Set<Therapy>;
  medications?: Set<Medication>;
}

export interface Symptom {
  id?: number; // 主键，数据库生成
  name: string; // 实体名称
  description?: string; // 实体描述
  createTime?: string; // 创建时间（ISO 格式）
  updateTime?: string; // 更新时间
  category?: string; // 症状分类（如情绪、认知、身体等）
  severity?: number; // 严重程度（1~10 之间的整数）
  duration?: string; // 持续时间描述
  isCommon?: boolean; // 是否为常见症状
  manifestations?: string; // 具体表现形式
}


export interface Risk {
  id?: number; // 主键，数据库生成
  name: string; // 实体名称
  description?: string; // 实体描述
  createTime?: string; // 创建时间（ISO 格式字符串）
  updateTime?: string; // 更新时间
  category?: string; // 风险类别（如生物学、心理学等）
  impactFactor?: number; // 影响因子（0~1之间的数值）
  evidenceLevel?: string; // 证据级别（如A、B、C）
  preventiveMeasures?: string; // 预防措施
}


export interface Therapy {
  id?: number; // 主键，数据库生成
  name: string; // 实体名称
  description?: string; // 实体描述
  createTime?: string; // 创建时间（ISO 格式字符串）
  updateTime?: string; // 更新时间
  category?: string; // 治疗类别（如心理治疗、物理治疗等）
  approach?: string; // 具体方法（如认知行为疗法、电休克治疗等）
  durationCourse?: string; // 治疗周期
  sideEffects?: string; // 副作用
}


export interface Medication {
  id?: number; // 主键，数据库生成
  name: string; // 实体名称
  description?: string; // 实体描述
  createTime?: string; // 创建时间，ISO 格式字符串
  updateTime?: string; // 更新时间
  genericName?: string; // 通用名
  brandNames?: string; // 品牌名列表
  drugClass?: string; // 药物分类
  mechanism?: string; // 作用机制
  dosage?: string; // 剂量信息
  administrationRoute?: string; // 给药途径
  sideEffects?: string; // 副作用列表
  contraindications?: string; // 禁忌症
  interactions?: string; // 药物相互作用
}

