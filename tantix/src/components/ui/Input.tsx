import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  prefix,
  suffix,
  error,
  hint,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--neu-text-secondary)]">
            {label}
          </label>
          {hint && !error && (
            <span className="text-[10px] text-[var(--neu-text-muted)] font-mono-numbers">{hint}</span>
          )}
        </div>
      )}

      <div
        className={`relative flex items-center neu-inset px-3 py-2 rounded-xl transition-all border ${
          error
            ? 'border-[var(--accent-rose)] shadow-[0_0_8px_rgba(244,63,94,0.2)]'
            : 'border-[var(--neu-border-subtle)] focus-within:border-[var(--accent-cyan)] focus-within:shadow-[0_0_10px_var(--accent-cyan-glow)]'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {prefix && (
          <span className="text-xs font-mono-numbers text-[var(--neu-text-muted)] mr-2 shrink-0 select-none">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          disabled={disabled}
          className={`w-full bg-transparent text-sm text-[var(--neu-text-primary)] placeholder-[var(--neu-text-muted)] outline-none font-mono-numbers ${className}`}
          {...props}
        />

        {suffix && (
          <span className="text-xs font-mono-numbers text-[var(--neu-text-muted)] ml-2 shrink-0 select-none">
            {suffix}
          </span>
        )}
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
