"use client";

import { cn } from "@/shared/utils/cn";

export default function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  padding = "md",
  hover = false,
  elev = false,
  className,
  ...props
}) {
  const paddings = {
    none: "",
    xs: "p-3",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-[#071221]/85 border border-cyan-300/15 backdrop-blur-xl",
        elev ? "rounded-[16px] shadow-[var(--shadow-elev)]" : "rounded-[16px] shadow-[var(--shadow-soft)]",
        "before:absolute before:inset-0 before:pointer-events-none",
        "before:bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.10),transparent_45%),radial-gradient(circle_at_70%_10%,rgba(56,189,248,.08),transparent_40%)]",
        hover && "hover:shadow-[var(--shadow-warm)] hover:border-cyan-300/30 transition-all cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {(title || action) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 rounded-[12px] bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20 shadow-[0_0_18px_-10px_rgba(34,211,238,.9)]">
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-cyan-50 font-semibold tracking-tight">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-slate-400">{subtitle}</p>
                )}
              </div>
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

Card.Section = function CardSection({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-4 rounded-[10px]",
        "bg-bg border border-border-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Row = function CardRow({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-3 -mx-3 px-3 transition-colors",
        "border-b border-border-subtle last:border-b-0",
        "hover:bg-surface-2/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.ListItem = function CardListItem({
  children,
  actions,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 -mx-3 px-3",
        "border-b border-border-subtle last:border-b-0",
        "hover:bg-surface-2/50 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {actions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions}
        </div>
      )}
    </div>
  );
};

