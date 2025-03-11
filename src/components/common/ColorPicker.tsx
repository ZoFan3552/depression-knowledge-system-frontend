import React from "react";

/**
 * 颜色选择器组件的属性接口
 */
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * 颜色选择器组件
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer border-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
    </div>
  </div>
);
