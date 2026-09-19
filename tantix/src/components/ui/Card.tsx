import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'inset' | 'flat';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'raised',
  className = '',
  children,
  ...props
}) => {
  const variantClass =
    variant === 'raised'
      ? 'neu-raised-card'
      : variant === 'inset'
      ? 'neu-inset'
      : 'bg-[var(--neu-surface)] border border-[var(--neu-border-subtle)] rounded-2xl';

  return (
    <div className={`${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
