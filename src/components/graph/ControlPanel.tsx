'use client'

import React, { useState } from "react";
import { useGraphConfigStore } from "@/store/useGraphConfigStore"; // 假设store文件路径
import { ColorPicker } from "../common/ColorPicker";
import { Slider } from "../common/Slider";

/**
 * 滑块配置类型
 */
interface SliderConfig {
  min: number;
  max: number;
  label: string;
  step: number;
}

/**
 * 所有控制参数的滑块配置
 */
const SLIDER_CONFIGS: Record<string, SliderConfig> = {
  nodeRadius: {
    min: 5,
    max: 50,
    label: "节点大小",
    step: 1,
  },
  linkDistance: {
    min: 50,
    max: 400,
    label: "连接线长度",
    step: 5,
  },
  chargeStrength: {
    min: 100,
    max: 1000,
    label: "斥力强度",
    step: 10,
  },
  linkWidth: {
    min: 0.5,
    max: 5,
    label: "连接线宽度",
    step: 0.1,
  },
  width: {
    min: 400,
    max: 2000,
    label: "画布宽度",
    step: 50,
  },
  height: {
    min: 400,
    max: 2000,
    label: "画布高度",
    step: 50,
  },
  maxZoom: {
    min: 1,
    max: 10,
    label: "最大缩放",
    step: 0.5,
  },
  minZoom: {
    min: 0.1,
    max: 1,
    label: "最小缩放",
    step: 0.05,
  },
  zoomStep: {
    min: 1.1,
    max: 2,
    label: "缩放步长",
    step: 0.1,
  },
};

/**
 * 力导向图全面控制面板组件
 */
const ControlPanel: React.FC = () => {
  // 使用Zustand store获取所有配置和更新函数
  const graphConfig = useGraphConfigStore();
  const { updateConfig } = graphConfig;

  const [isShowLinkLabel, setIsShowLinkLabel] = useState(false);
  // 控制面板的展开/折叠状态
  const [expandedSection, setExpandedSection] = useState("");
  // 控制面板的显示/隐藏状态
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  // 创建处理函数：根据参数名更新配置
  const handleConfigChange = (param: string, value: unknown) => {
    updateConfig({ [param]: value });
  };

  const handleChargeStrengthChange = (value: number) => {
    updateConfig({ chargeStrength: Number(value) });
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="fixed left-0 top-[400px] z-10">
      {/* 触发按钮 */}
      <button
        onClick={togglePanel}
        className="flex h-12 w-12 items-center justify-center rounded-r-lg bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors duration-200"
        aria-label="打开设置面板"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* 控制面板 */}
      {isPanelVisible && (
        <div
          className="absolute left-0 top-[-232.5px] w-[334px] h-[525px] overflow-auto rounded-r-lg bg-white p-6 shadow-xl transition-all duration-300 border-r border-t border-b border-gray-200"
          style={{ transform: isPanelVisible ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">图形配置</h3>
            <button
              onClick={() => {
                setExpandedSection("");
                setIsPanelVisible(false);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="关闭面板"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 基础设置 */}
          <div className="mb-4">
            <button
              className="flex w-full items-center justify-between py-2 font-medium"
              onClick={() =>
                setExpandedSection(expandedSection === "basic" ? "" : "basic")
              }
            >
              <span>基础设置</span>
              <span>{expandedSection === "basic" ? "▼" : "▶"}</span>
            </button>

            {expandedSection === "basic" && (
              <div className="mt-2">
                <Slider
                  {...SLIDER_CONFIGS.nodeRadius}
                  value={graphConfig.nodeRadius}
                  onChange={(value) => handleConfigChange("nodeRadius", value)}
                />

                <Slider
                  {...SLIDER_CONFIGS.linkDistance}
                  value={graphConfig.linkDistance}
                  onChange={(value) => handleConfigChange("linkDistance", value)}
                />

                <Slider
                  {...SLIDER_CONFIGS.chargeStrength}
                  value={Math.abs(graphConfig.chargeStrength)}
                  onChange={handleChargeStrengthChange}
                  displayValue={Math.abs(graphConfig.chargeStrength)}
                />

                <Slider
                  {...SLIDER_CONFIGS.linkWidth}
                  value={graphConfig.linkWidth}
                  onChange={(value) => handleConfigChange("linkWidth", value)}
                />

                <ColorPicker
                  label="节点默认颜色"
                  value={graphConfig.nodeDefaultColor}
                  onChange={(value) =>
                    handleConfigChange("nodeDefaultColor", value)
                  }
                />

                <ColorPicker
                  label="连线默认颜色"
                  value={graphConfig.linkDefaultColor}
                  onChange={(value) =>
                    handleConfigChange("linkDefaultColor", value)
                  }
                />

                <div className="mt-4 flex items-center space-x-2">
                  <label className="inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isShowLinkLabel}
                      onChange={(e) => {
                        setIsShowLinkLabel(e.target.checked);
                        handleConfigChange("isShowLinkLabel", e.target.checked)
                      }
                      }
                      className="form-checkbox h-4 w-4 rounded text-blue-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      显示连线标签
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 画布设置 */}
          <div className="mb-4">
            <button
              className="flex w-full items-center justify-between py-2 font-medium"
              onClick={() =>
                setExpandedSection(expandedSection === "canvas" ? "" : "canvas")
              }
            >
              <span>画布设置</span>
              <span>{expandedSection === "canvas" ? "▼" : "▶"}</span>
            </button>

            {expandedSection === "canvas" && (
              <div className="mt-2">
                <Slider
                  {...SLIDER_CONFIGS.width}
                  value={graphConfig.width}
                  onChange={(value) => handleConfigChange("width", value)}
                />

                <Slider
                  {...SLIDER_CONFIGS.height}
                  value={graphConfig.height}
                  onChange={(value) => handleConfigChange("height", value)}
                />
              </div>
            )}
          </div>

          {/* 缩放设置 */}
          <div className="mb-4">
            <button
              className="flex w-full items-center justify-between py-2 font-medium"
              onClick={() =>
                setExpandedSection(expandedSection === "zoom" ? "" : "zoom")
              }
            >
              <span>缩放设置</span>
              <span>{expandedSection === "zoom" ? "▼" : "▶"}</span>
            </button>

            {expandedSection === "zoom" && (
              <div className="mt-2">
                <Slider
                  {...SLIDER_CONFIGS.maxZoom}
                  value={graphConfig.maxZoom}
                  onChange={(value) => handleConfigChange("maxZoom", value)}
                />

                <Slider
                  {...SLIDER_CONFIGS.minZoom}
                  value={graphConfig.minZoom}
                  onChange={(value) => handleConfigChange("minZoom", value)}
                />

                <Slider
                  {...SLIDER_CONFIGS.zoomStep}
                  value={graphConfig.zoomStep}
                  onChange={(value) => handleConfigChange("zoomStep", value)}
                />
              </div>
            )}
          </div>

          {/* 重置按钮 */}
          <button
            onClick={() => {
              // 重置为默认配置
              updateConfig({
                width: 800,
                height: 800,
                nodeRadius: 10,
                chargeStrength: -600,
                nodeDefaultColor: "#4B5563",
                linkDefaultColor: "#9CA3AF",
                linkDistance: 100,
                linkWidth: 1.5,
                maxZoom: 4,
                minZoom: 0.1,
                zoomStep: 1.5,
              });
            }}
            className="mt-6 w-full rounded-md bg-blue-50 px-4 py-2.5 text-blue-600 font-medium transition-colors duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            重置为默认配置
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;