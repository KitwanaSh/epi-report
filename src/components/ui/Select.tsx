"use client";

import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  placeholder = "Sélectionner...",
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
  const errorBorderClass = error
    ? "border-status-error focus:border-status-error focus:ring-status-error"
    : "";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={selectId}
        className="text-[14px] font-bold text-text-primary"
      >
        {label}
      </label>

      <select
        id={selectId}
        className={`select-field ${errorBorderClass} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-[13px] text-status-error">{error}</span>
      )}
    </div>
  );
}