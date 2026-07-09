import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "ink",
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  accent?: "ink" | "signal" | "link";
}) {
  const accentClass =
    accent === "signal"
      ? "text-signal"
      : accent === "link"
        ? "text-link"
        : "text-ink";

  return (
    <div className="rounded-lg border border-line bg-bg-raised p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-faint font-mono">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${accentClass}`} strokeWidth={2} />
      </div>
      <div>
        <p
          className={`font-display text-2xl font-semibold tracking-tight ${accentClass}`}
        >
          {value}
        </p>
        {detail && <p className="text-xs text-ink-faint mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}
