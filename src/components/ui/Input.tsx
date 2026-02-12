"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const errorBorderClass = error
    ? "border-status-error focus:border-status-error focus:ring-status-error"
    : "";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-[14px] font-bold text-text-primary"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={`input-field ${errorBorderClass} ${className}`}
        {...props}
      />

      {error && (
        <span className="text-[13px] text-status-error">{error}</span>
      )}
    </div>
  );
}