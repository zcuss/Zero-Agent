"use client";

import PropTypes from "prop-types";
import Card from "@/shared/components/Card";

const fmt = (n) => new Intl.NumberFormat().format(n || 0);
const fmtCost = (n) => `$${(n || 0).toFixed(2)}`;

export default function OverviewCards({ stats }) {
  const cards = [
    {
      title: "Total Requests",
      value: fmt(stats.totalRequests),
      tone: "text-cyan-100",
      icon: "query_stats",
      ring: "ring-cyan-300/20",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Input Tokens",
      value: fmt(stats.totalPromptTokens),
      tone: "text-cyan-200",
      icon: "keyboard",
      ring: "ring-indigo-300/20",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Output Tokens",
      value: fmt(stats.totalCompletionTokens),
      tone: "text-emerald-200",
      icon: "output",
      ring: "ring-emerald-300/20",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Estimated Cost",
      value: `~${fmtCost(stats.totalCost)}`,
      tone: "text-amber-200",
      icon: "attach_money",
      ring: "ring-amber-300/20",
      bg: "bg-amber-500/10",
      hint: "Estimated, not actual billing",
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`relative overflow-hidden border border-white/10 ${card.ring} ring-1`}>
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/5 blur-xl" />
          <div className="flex items-start justify-between gap-3 px-4 py-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-semibold">{card.title}</span>
              <span className={`truncate text-2xl font-semibold ${card.tone}`}>{card.value}</span>
              {card.hint ? <span className="text-[10px] text-text-muted">{card.hint}</span> : null}
            </div>
            <div className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
              <span className="material-symbols-outlined text-[18px] text-white/90">{card.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

OverviewCards.propTypes = {
  stats: PropTypes.object.isRequired,
};
