"use client";

import { cn } from "@/shared/utils/cn";

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}) {
  const sizes = {
    sm: { track: "w-9 h-5", thumb: "size-4", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "size-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "size-6", translate: "translate-x-7" },
  };

  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative inline-flex shrink-0 rounded-full border",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400/30",
          checked
            ? "bg-cyan-400/20 border-cyan-300/50 shadow-[0_0_16px_-8px_rgba(34,211,238,.8)]"
            : "bg-surface-2 border-border-subtle",
          sizes[size].track,
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full border",
            "transform transition duration-200 ease-out",
            checked ? sizes[size].translate : "translate-x-0.5",
            sizes[size].thumb,
            checked
              ? "mt-0.5 bg-cyan-300 border-cyan-100"
              : "mt-0.5 bg-surface-3 border-border-subtle"
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-text-main">{label}</span>
          )}
          {description && (
            <span className="text-xs text-text-muted">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

