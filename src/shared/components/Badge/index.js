"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  default: "bg-surface-2 text-text-muted border border-border-subtle",
  primary: "bg-cyan-400/10 text-cyan-200 border border-cyan-300/25",
  success: "bg-emerald-400/10 text-emerald-300 border border-emerald-300/20",
  warning: "bg-amber-400/10 text-amber-300 border border-amber-300/20",
  error: "bg-rose-400/10 text-rose-300 border border-rose-300/20",
  info: "bg-sky-400/10 text-sky-300 border border-sky-300/20",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            variant === "success" && "bg-emerald-300",
            variant === "warning" && "bg-amber-300",
            variant === "error" && "bg-rose-300",
            variant === "info" && "bg-sky-300",
            variant === "primary" && "bg-cyan-300",
            variant === "default" && "bg-slate-400"
          )}
        />
      )}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
}

