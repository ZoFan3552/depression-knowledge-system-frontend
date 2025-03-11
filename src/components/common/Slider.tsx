import React from "react";

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
export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  step = 1,
  displayValue,
}) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}: {displayValue !== undefined ? displayValue : value}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
    />
  </div>
);
