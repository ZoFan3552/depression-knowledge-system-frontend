import React from 'react';

/**
 * 控制面板的各个滑块范围配置
 */
const SLIDER_CONFIGS = {
  nodeRadius: {
    min: 10,
    max: 50,
    label: '节点大小',
    step: 1
  },
  linkDistance: {
    min: 50,
    max: 400,
    label: '连接线长度',
    step: 5
  },
  chargeStrength: {
    min: 100,
    max: 1000,
    label: '排斥力强度',
    step: 10
  }
} as const;

/**
 * 控制面板组件的属性接口
 * @interface PanelProps
 * @property {number} nodeRadius - 节点半径大小
 * @property {(value: number) => void} setNodeRadius - 设置节点半径的回调函数
 * @property {number} linkDistance - 连接线长度
 * @property {(value: number) => void} setLinkDistance - 设置连接线长度的回调函数
 * @property {number} chargeStrength - 节点间排斥力强度
 * @property {(value: number) => void} setChargeStrength - 设置排斥力强度的回调函数
 * @property {boolean} isShowLinkLabel - 是否显示连接线标签
 * @property {(value: boolean) => void} setIsShowLinkLabel - 设置是否显示连接线标签的回调函数
 */
interface PanelProps {
  nodeRadius: number;
  setNodeRadius: (value: number) => void;
  linkDistance: number;
  setLinkDistance: (value: number) => void;
  chargeStrength: number;
  setChargeStrength: (value: number) => void;
  isShowLinkLabel: boolean;
  setIsShowLinkLabel: (value: boolean) => void;
}

/**
 * 滑块组件的属性接口
 */
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  step?: number;
  displayValue?: number | string;
}

/**
 * 可重用的滑块组件
 */
const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  step = 1,
  displayValue
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}: {displayValue ?? value}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
    />
  </div>
);

/**
 * 力导向图控制面板组件
 * 提供节点大小、连接线长度、排斥力强度等参数的调节功能
 */
const ControlPanel: React.FC<PanelProps> = ({
  nodeRadius,
  setNodeRadius,
  linkDistance,
  setLinkDistance,
  chargeStrength,
  setChargeStrength,
  isShowLinkLabel,
  setIsShowLinkLabel
}) => {
  return (
    <div className="space-y-4 p-4">
      <Slider
        {...SLIDER_CONFIGS.nodeRadius}
        value={nodeRadius}
        onChange={setNodeRadius}
      />
      
      <Slider
        {...SLIDER_CONFIGS.linkDistance}
        value={linkDistance}
        onChange={setLinkDistance}
      />
      
      <Slider
        {...SLIDER_CONFIGS.chargeStrength}
        value={Math.abs(chargeStrength)}
        onChange={(value) => setChargeStrength(-value)}
        displayValue={Math.abs(chargeStrength)}
      />

      <div className="flex items-center space-x-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isShowLinkLabel}
            onChange={(e) => setIsShowLinkLabel(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600 rounded 
                       focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            显示连线标签
          </span>
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;