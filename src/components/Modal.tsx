import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * [THANH - MODULE 8 UI COMPONENT]: Component Modal dùng chung hiển thị chi tiết văn bằng, form, thông báo
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001e40]/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`bg-white border border-[#c3c6d1] rounded-2xl shadow-xl w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-[#f0f1f5]">
            <div>
              {title && <h3 className="font-serif text-xl font-bold text-[#001e40]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#505f76] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737780] hover:text-[#001e40] hover:bg-[#f4f3f8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 bg-[#f9f9fe] border-t border-[#f0f1f5] flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
