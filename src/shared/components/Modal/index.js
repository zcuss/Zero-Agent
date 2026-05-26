"use client";

import { useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import Button from "../Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  className,
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-[var(--shadow-elev)] fade-in",
          sizes[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-subtle">Zero Agent</p>
              <h2 className="mt-0.5 text-base font-semibold tracking-tight text-text-main">{title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-surface-2 hover:text-text-main"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        <div className="max-h-[calc(85vh-100px)] overflow-y-auto p-5 custom-scrollbar">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border-subtle bg-surface-2/45 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-text-muted">{message}</p>
    </Modal>
  );
}

