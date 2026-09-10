import { useEffect } from 'react';
import { HelpCircle, CheckCircle2, Trash2, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'primary', // 'primary' | 'action' | 'danger'
  isLoading = false,
  icon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'danger') return <Trash2 className="w-6 h-6 text-rose-600" />;
    if (variant === 'action') return <CheckCircle2 className="w-6 h-6 text-[#E08500]" />;
    return <HelpCircle className="w-6 h-6 text-[#2B4E86]" />;
  };

  const getIconBg = () => {
    if (variant === 'danger') return 'bg-rose-50 border-rose-200 text-rose-600';
    if (variant === 'action') return 'bg-[#FEF0DA] border-[#FAC780] text-[#E08500]';
    return 'bg-[#E8F2FE] border-[#CFE4FD] text-[#2B4E86]';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Dialog Card */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl border-2 border-[#CFE4FD] w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${getIconBg()} shrink-0 shadow-xs`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{title}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Konfirmasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="font-bold"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : variant === 'action' ? 'action' : 'primary'}
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
            className="font-extrabold shadow-xs"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};