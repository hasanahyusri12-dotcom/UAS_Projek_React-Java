import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'sage',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#2B4E86] hover:bg-[#223F6E] active:bg-[#1B3156] text-white shadow-md shadow-[#2B4E86]/20 border border-[#2B4E86]/30',
    deepblue: 'bg-[#2B4E86] hover:bg-[#223F6E] active:bg-[#1B3156] text-white shadow-md shadow-[#2B4E86]/20 border border-[#2B4E86]/30',
    action: 'bg-[#E08500] hover:bg-[#C47000] active:bg-[#9C5402] text-white shadow-md shadow-[#E08500]/25 border border-[#E08500]/30',
    amber: 'bg-[#E08500] hover:bg-[#C47000] active:bg-[#9C5402] text-white shadow-md shadow-[#E08500]/25 border border-[#E08500]/30',
    sage: 'bg-[#2B4E86] hover:bg-[#223F6E] active:bg-[#1B3156] text-white shadow-md shadow-[#2B4E86]/20 border border-[#2B4E86]/30',
    petrol: 'bg-[#1B3156] hover:bg-[#15253F] active:bg-[#0E182A] text-white shadow-md shadow-slate-900/20 border border-slate-700/30',
    ocean: 'bg-[#2B4E86] hover:bg-[#223F6E] active:bg-[#1B3156] text-white shadow-md shadow-[#2B4E86]/20 border border-[#2B4E86]/30',
    gradient: 'bg-gradient-to-r from-[#2B4E86] via-[#223F6E] to-[#1B3156] hover:from-[#223F6E] hover:to-[#15253F] text-white shadow-md shadow-[#2B4E86]/25 border-0',
    gradientAmber: 'bg-gradient-to-r from-[#E08500] to-[#F5A53B] hover:from-[#C47000] hover:to-[#E08500] text-white shadow-md shadow-[#E08500]/25 border-0',
    outline: 'bg-white hover:bg-[#F0F5FD] active:bg-[#E1ECFC] text-[#2B4E86] border-2 border-[#2B4E86]/30 shadow-xs font-bold',
    outlinePetrol: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-[#1B3156] border-2 border-[#1B3156]/30 shadow-xs font-bold',
    outlineAmber: 'bg-white hover:bg-[#FFF9F0] active:bg-[#FEF0DA] text-[#E08500] border-2 border-[#FAC780] shadow-xs font-bold',
    ghost: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 border-0',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm border border-rose-500',
    dangerOutline: 'bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 font-bold',
    softSage: 'bg-[#E8F2FE] hover:bg-[#CFE4FD] text-[#2B4E86] border border-[#A5CBFD]/60 font-bold',
    softBlue: 'bg-[#E8F2FE] hover:bg-[#CFE4FD] text-[#2B4E86] border border-[#A5CBFD]/60 font-bold',
    softAmber: 'bg-[#FEF0DA] hover:bg-[#FCDFB5] text-[#9C5402] border border-[#FAC780]/70 font-bold',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl font-bold gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-2xl font-bold gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl font-extrabold gap-2.5',
    icon: 'p-2.5 rounded-xl font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] ${
        variantStyles[variant] || variantStyles.sage
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
