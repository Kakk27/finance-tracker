import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle, XCircle, X } from 'lucide-react';
import type { Toast } from '@/types';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const toastElements = containerRef.current.querySelectorAll('.toast-item');
      const newestToast = toastElements[toastElements.length - 1];

      if (newestToast) {
        gsap.fromTo(
          newestToast,
          { opacity: 0, x: 50, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [toasts]);

  const handleRemove = (id: string, element: HTMLElement) => {
    gsap.to(element, {
      opacity: 0,
      x: 50,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => onRemove(id),
    });
  };

  if (toasts.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string, element: HTMLElement) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (itemRef.current) {
      onRemove(toast.id, itemRef.current);
    }
  };

  return (
    <div
      ref={itemRef}
      className="toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px]"
      style={{
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        border: toast.type === 'success' 
          ? '1px solid rgba(200, 240, 0, 0.3)' 
          : '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: toast.type === 'success'
          ? '0 8px 32px rgba(200, 240, 0, 0.15)'
          : '0 8px 32px rgba(239, 68, 68, 0.15)',
      }}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-[#c8f000] flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      )}

      <p className="text-sm text-white flex-1">{toast.message}</p>

      <button
        onClick={handleClose}
        className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        <X className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
}
