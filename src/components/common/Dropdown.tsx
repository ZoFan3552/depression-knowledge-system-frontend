import React, { useState, useCallback } from 'react';

type Option = {
  label: string;
  value: string;
};

interface DropdownProps {
  items: Option[];
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * 下拉框组件
 * 支持自定义选项、默认值、禁用状态等功能
 */
const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultValue = '',
  onChange,
  placeholder = '请选择一个选项',
  className = '',
  disabled = false
}) => {
  // 选中值的状态管理
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  /**
   * 处理选项改变事件
   * 更新内部状态并触发外部回调
   */
  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  }, [onChange]);

  return (
    <div className="relative">
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        disabled={disabled}
        aria-label={placeholder}
        className={`
          block w-full px-4 py-2
          bg-white border border-gray-300 rounded-md
          shadow-sm appearance-none
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition duration-150 ease-in-out
          ${className}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {items.map((item) => (
          <option
            key={`${item.value}-${item.label}`}
            value={item.value}
            className="py-1"
          >
            {item.label}
          </option>
        ))}
      </select>

      {/* 自定义下拉箭头 */}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;