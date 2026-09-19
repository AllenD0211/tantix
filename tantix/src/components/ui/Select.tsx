import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  subLabel?: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  hint,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={selectId} className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            {label}
          </label>
          {hint && !error && (
            <span className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">{hint}</span>
          )}
        </div>
      )}

      <div
        className={`relative flex items-center neu-inset rounded-xl transition-all border ${
          error
            ? 'border-[var(--accent-rose)] shadow-[0_0_8px_rgba(244,63,94,0.2)]'
            : 'border-[var(--neu-border-subtle)] focus-within:border-[var(--accent-cyan)] focus-within:shadow-[0_0_10px_var(--accent-cyan-glow)]'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <select
          id={selectId}
          disabled={disabled}
          className={`w-full bg-transparent text-sm text-[var(--neu-text-primary)] px-3 py-2 pr-8 appearance-none outline-none font-mono-numbers cursor-pointer [&>option]:bg-[var(--neu-surface-elevated)] [&>option]:text-[var(--neu-text-primary)] ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label} {option.subLabel ? `(${option.subLabel})` : ''}
            </option>
          ))}
        </select>

        <ChevronDown className="w-4 h-4 text-[var(--neu-text-muted)] absolute right-3 pointer-events-none select-none" />
      </div>

      {error && (
        <p className="text-[11px] text-[var(--accent-rose)] font-medium flex items-center gap-1 animate-fadeIn">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
