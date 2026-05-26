"use client";

import { cn } from "@/shared/utils/cn";

const baseTone = "border border-cyan-300/20 backdrop-blur-sm";

const variants = {
  primary: `${baseTone} bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-[0_0_22px_-8px_rgba(56,189,248,.9)] disabled:bg-surface-3 disabled:text-text-muted`,
  secondary: `${baseTone} bg-[#0e2238] hover:bg-[#13304d] text-cyan-100 disabled:opacity-50`,
  outline: `${baseTone} bg-transparent text-cyan-100 hover:bg-cyan-500/10 hover:border-cyan-300/40`,
  ghost: "text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100",
  danger: `${baseTone} bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white disabled:bg-surface-3 disabled:text-text-muted`,
  success: `${baseTone} bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 disabled:bg-surface-3 disabled:text-text-muted`,
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-[10px]",
  md: "h-10 px-4 text-sm rounded-[12px]",
  lg: "h-12 px-6 text-sm rounded-[12px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-out cursor-pointer",
        "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
}

