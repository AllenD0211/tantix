import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-xs font-semibold rounded-xl gap-2',
    lg: 'px-5 py-3 text-sm font-bold rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary: 'neu-btn-primary cursor-pointer',
    secondary: 'neu-btn text-[var(--neu-text-primary)] hover:text-[var(--accent-cyan)] cursor-pointer',
    outline: 'border border-[var(--neu-border-subtle)] text-[var(--neu-text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] cursor-pointer bg-transparent',
    danger: 'neu-btn text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 cursor-pointer',
    success: 'neu-btn text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/10 cursor-pointer',
    ghost: 'text-[var(--neu-text-muted)] hover:text-[var(--neu-text-primary)] hover:bg-[var(--neu-surface-elevated)] cursor-pointer rounded-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      className={`inline-flex items-center justify-center transition-all select-none ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
