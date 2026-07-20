import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * [THANH - MODULE 8 UI COMPONENT]: Component Button dùng chung cho toàn bộ giao diện
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-sans font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#001e40] hover:bg-[#003366] text-white shadow-xs',
    secondary: 'bg-[#f4f3f8] hover:bg-[#e0e2ec] text-[#001e40] border border-[#c3c6d1]',
    outline: 'bg-transparent hover:bg-[#f4f3f8] text-[#001e40] border border-[#001e40]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-xs',
    ghost: 'bg-transparent hover:bg-[#f4f3f8] text-[#505f76] hover:text-[#001e40]',
  };

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-5 text-sm',
    lg: 'py-3.5 px-8 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 stroke-[2]" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
