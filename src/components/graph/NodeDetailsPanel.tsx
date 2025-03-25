import React, { useEffect, useRef, useState } from "react";
import { GraphNode } from "@/types/graph";
import {
  Disease,
  Symptom,
  Risk,
  Therapy,
  Medication,
} from "@/types/depression";

// 定义可能的节点数据类型
type NodeData = Disease | Symptom | Risk | Therapy | Medication;

interface NodeDetailsPanelProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  isOpen,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const nodeDetails = node?.originalData;
  // 处理点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 添加一个状态来控制面板的可见性和动画
  const [visible, setVisible] = useState(false);

  // 监听isOpen的变化，控制可见性
  useEffect(() => {
    if (isOpen) {
      // 当打开时，立即显示面板（但位于屏幕外）
      setVisible(true);
      // 使用requestAnimationFrame确保DOM更新后再应用动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (panelRef.current) {
            panelRef.current.classList.remove("translate-x-full");
            panelRef.current.classList.add("translate-x-0");
          }
        });
      });
    } else {
      // 关闭时，先应用动画
      if (panelRef.current) {
        panelRef.current.classList.remove("translate-x-0");
        panelRef.current.classList.add("translate-x-full");
      }
      // 等待动画完成后隐藏面板
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // 与动画持续时间相同
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 如果没有节点数据或不应该可见，则不渲染
  if (!nodeDetails || (!isOpen && !visible)) return null;

  // 获取节点类型和对应的样式，使用提供的颜色标准
  const getNodeTypeInfo = (
    node: NodeData,
  ): { type: string; color: string; bgColor: string; hexColor: string } => {
    if ("medicalCode" in node) {
      return {
        type: "疾病",
        color: "text-red-600",
        bgColor: "bg-red-50",
        hexColor: "#FF6B6B", // 红色
      };
    }
    if ("severity" in node) {
      return {
        type: "症状",
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        hexColor: "#4ECDC4", // 青色
      };
    }
    if ("impactFactor" in node) {
      return {
        type: "风险因素",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        hexColor: "#FFA500", // 橙色
      };
    }
    if ("approach" in node) {
      return {
        type: "治疗方法",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        hexColor: "#7DCFB6", // 绿色
      };
    }
    if ("drugClass" in node) {
      return {
        type: "药物",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        hexColor: "#9D65C9", // 紫色
      };
    }
    return {
      type: "未知类型",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      hexColor: "#718096",
    };
  };

  const { type, color, bgColor, hexColor } = getNodeTypeInfo(nodeDetails);

  // 渲染信息项目
  const renderInfoItem = (
    label: string,
    value: string | number | boolean | null | undefined,
    multiline = false,
  ) => {
    if (value === undefined || value === null || value === "") return null;

    return (
      <div className="mb-4">
        <div className="text-sm font-bold text-black">{label}</div>
        {multiline ? (
          <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
            {value}
          </p>
        ) : (
          <div className="mt-1 text-gray-800">
            {typeof value === "boolean" ? (value ? "是" : "否") : value}
          </div>
        )}
      </div>
    );
  };

  // 根据节点类型渲染不同的详情内容
  const renderDetails = () => {
    switch (type) {
      case "疾病":
        const disease = nodeDetails as Disease;
        return (
          <div className="space-y-2 divide-y divide-gray-100">
            <div className="pb-2">
              {renderInfoItem("疾病分类", disease.category)}
              {renderInfoItem("医学编码", disease.medicalCode)}
              {renderInfoItem(
                "患病率",
                disease.prevalenceRate ? `${disease.prevalenceRate}%` : null,
              )}
              {renderInfoItem("同义词", disease.synonyms)}
            </div>
            <div className="py-2">
              {renderInfoItem("诊断标准", disease.diagnosticCriteria, true)}
            </div>
            {disease.symptoms && disease.symptoms.size > 0 && (
              <div className="pt-2">
                <div className="mb-2 text-sm font-bold text-black">
                  相关症状
                </div>
                <ul className="list-disc space-y-1 pl-5">
                  {Array.from(disease.symptoms).map((symptom, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {symptom.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "症状":
        const symptom = nodeDetails as Symptom;
        return (
          <div className="space-y-2 divide-y divide-gray-100">
            <div className="pb-2">
              {renderInfoItem("症状分类", symptom.category)}
              {renderInfoItem(
                "严重程度",
                symptom.severity ? `${symptom.severity}/10` : null,
              )}
              {renderInfoItem("持续时间", symptom.duration)}
              {renderInfoItem("是否常见", symptom.isCommon)}
            </div>
            <div className="py-2">
              {renderInfoItem("表现形式", symptom.manifestations, true)}
            </div>
          </div>
        );

      case "风险因素":
        const risk = nodeDetails as Risk;
        return (
          <div className="space-y-2 divide-y divide-gray-100">
            <div className="pb-2">
              {renderInfoItem("风险类别", risk.category)}
              {renderInfoItem(
                "影响因子",
                risk.impactFactor ? risk.impactFactor.toFixed(2) : null,
              )}
              {renderInfoItem("证据级别", risk.evidenceLevel)}
            </div>
            <div className="py-2">
              {renderInfoItem("预防措施", risk.preventiveMeasures, true)}
            </div>
          </div>
        );

      case "治疗方法":
        const therapy = nodeDetails as Therapy;
        return (
          <div className="space-y-2 divide-y divide-gray-100">
            <div className="pb-2">
              {renderInfoItem("治疗类别", therapy.category)}
              {renderInfoItem("具体方法", therapy.approach)}
              {renderInfoItem("治疗周期", therapy.durationCourse)}
            </div>
            <div className="py-2">
              {renderInfoItem("副作用", therapy.sideEffects, true)}
            </div>
          </div>
        );

      case "药物":
        const medication = nodeDetails as Medication;
        return (
          <div className="space-y-2 divide-y divide-gray-100">
            <div className="pb-2">
              {renderInfoItem("通用名", medication.genericName)}
              {renderInfoItem("品牌名", medication.brandNames)}
              {renderInfoItem("药物分类", medication.drugClass)}
              {renderInfoItem("剂量信息", medication.dosage)}
              {renderInfoItem("给药途径", medication.administrationRoute)}
            </div>
            <div className="py-2">
              {renderInfoItem("作用机制", medication.mechanism, true)}
            </div>
            <div className="py-2">
              {renderInfoItem("副作用", medication.sideEffects, true)}
            </div>
            <div className="py-2">
              {renderInfoItem("禁忌症", medication.contraindications, true)}
            </div>
          </div>
        );

      default:
        return <div className="italic text-gray-500">暂无详细信息</div>;
    }
  };

  return (
    <>
      {/* 半透明背景遮罩 */}
      <div
        className={`fixed inset-0 z-40 bg-black backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "bg-opacity-30 opacity-100"
            : "pointer-events-none bg-opacity-0 opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 信息展示面板 */}
      <div
        ref={panelRef}
        className="fixed right-0 top-[70px] z-50 flex h-[670px] w-80 translate-x-full flex-col overflow-hidden rounded-l-lg bg-white shadow-xl transition-transform duration-300 ease-in-out md:w-96"
        style={{ maxHeight: "calc(100vh - 70px)" }}
      >
        {/* 标题区域 */}
        <div className={`p-5`} style={{ backgroundColor: `${hexColor}16` }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: hexColor }}>
                {nodeDetails.name}
              </h3>
              <div
                className="mt-1 inline-block rounded-full bg-white bg-opacity-50 px-2 py-0.5 text-xs font-medium shadow"
                style={{ color: hexColor }}
              >
                {type}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-white hover:bg-opacity-20 hover:text-gray-700"
              aria-label="关闭"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 描述信息 */}
          {nodeDetails.description && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">{nodeDetails.description}</p>
            </div>
          )}
        </div>

        {/* 详细信息滚动区域 */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="text-sm">{renderDetails()}</div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
          {nodeDetails.createTime && (
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                创建: {new Date(nodeDetails.createTime).toLocaleString("zh-CN")}
              </span>
            </div>
          )}
          {nodeDetails.updateTime && (
            <div className="mt-1 flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>
                更新: {new Date(nodeDetails.updateTime).toLocaleString("zh-CN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NodeDetailsPanel;
