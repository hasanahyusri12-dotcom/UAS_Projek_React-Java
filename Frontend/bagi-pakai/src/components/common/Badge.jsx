
export const Badge = ({ children, variant = 'sage', size = 'md', className = '' }) => {
  const variantStyles = {
    sage: 'bg-[#E8F2FE] text-[#2B4E86] border-[#A5CBFD] font-bold',
    primary: 'bg-[#E8F2FE] text-[#2B4E86] border-[#A5CBFD] font-bold',
    deepblue: 'bg-[#E8F2FE] text-[#2B4E86] border-[#A5CBFD] font-bold',
    petrol: 'bg-[#F0F6FE] text-[#2B4E86] border-[#CFE4FD] font-bold',
    ocean: 'bg-[#F0F6FE] text-[#2B4E86] border-[#CFE4FD] font-bold',
    lightblue: 'bg-[#F4F8FE] text-[#2B4E86] border-[#CFE4FD] font-bold',
    amber: 'bg-[#FEF0DA] text-[#C47000] border-[#FAC780] font-bold',
    coral: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
    success: 'bg-[#E6F8F0] text-[#16A34A] border-[#A7F3D0] font-bold',
    gradient: 'bg-gradient-to-r from-[#2B4E86] to-[#E08500] text-white border-transparent shadow-xs font-bold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-bold',
    md: 'text-xs px-3 py-1 rounded-full font-bold',
    lg: 'text-sm px-4 py-1.5 rounded-full font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border transition-colors ${variantStyles[variant] || variantStyles.sage} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
    >
      {children}
    </span>
  );
};
