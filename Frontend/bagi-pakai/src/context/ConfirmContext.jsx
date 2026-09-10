import { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Lanjutkan',
    cancelText: 'Batal',
    variant: 'primary', // 'danger' | 'warning' | 'primary' | 'success'
    icon: null,
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(
    ({
      title = 'Konfirmasi Aksi',
      message = 'Apakah kamu yakin ingin melanjutkan tindakan ini?',
      confirmText = 'Ya, Lanjutkan',
      cancelText = 'Batal',
      variant = 'primary',
      icon = null,
    }) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setDialogState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          icon,
        });
      });
    },
    []
  );

  const handleClose = (result) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  const getVariantStyles = () => {
    switch (dialogState.variant) {
      case 'danger':
        return {
          iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
          confirmBtnVariant: 'danger',
          badgeText: 'Perhatian / Hapus',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          defaultIcon: <Trash2 className="w-6 h-6" />,
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
          confirmBtnVariant: 'action',
          badgeText: 'Peringatan',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          defaultIcon: <AlertTriangle className="w-6 h-6" />,
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          confirmBtnVariant: 'gradient',
          badgeText: 'Konfirmasi Persetujuan',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          defaultIcon: <CheckCircle2 className="w-6 h-6" />,
        };
      case 'primary':
      default:
        return {
          iconBg: 'bg-[#E1ECFC] text-[#2B4E86] border-[#CFE4FD]',
          confirmBtnVariant: 'gradient',
          badgeText: 'Konfirmasi Aksi',
          badgeBg: 'bg-[#F0F5FD] text-[#2B4E86] border-[#CFE4FD]',
          defaultIcon: <Sparkles className="w-6 h-6" />,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Confirmation Modal */}
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => handleClose(false)}
          />

          {/* Dialog Card */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl border-2 border-[#CFE4FD] w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-6">
            {/* Header with Icon & Close */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs ${styles.iconBg}`}
                >
                  {dialogState.icon || styles.defaultIcon}
                </div>
                <div>
                  <span
                    className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${styles.badgeBg}`}
                  >
                    {styles.badgeText}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {dialogState.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleClose(false)}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="text-sm text-slate-600 font-medium leading-relaxed bg-[#F7F9FC] p-4 rounded-2xl border border-slate-200">
              {dialogState.message}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleClose(false)}
                className="font-bold"
              >
                {dialogState.cancelText}
              </Button>
              <Button
                variant={styles.confirmBtnVariant}
                size="md"
                onClick={() => handleClose(true)}
                className="font-black shadow-md"
              >
                {dialogState.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};