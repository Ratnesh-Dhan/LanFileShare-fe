import { ArrowUp, ArrowDown, Pause, RotateCcw, X, Check } from "lucide-react";
import type { Transfer } from "@/lib/mock-data";

const statusMeta: Record<Transfer["status"], { label: string; class: string }> =
  {
    active: { label: "Transferring", class: "text-link" },
    queued: { label: "Queued", class: "text-ink-faint" },
    paused: { label: "Paused", class: "text-signal" },
    done: { label: "Complete", class: "text-link" },
    failed: { label: "Failed", class: "text-danger" },
  };

export default function TransferRow({ transfer }: { transfer: Transfer }) {
  const meta = statusMeta[transfer.status];
  const barColor =
    transfer.status === "failed"
      ? "bg-danger"
      : transfer.status === "done"
        ? "bg-link"
        : "bg-signal";

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-line-soft last:border-0">
      <div className="w-8 h-8 rounded-md bg-bg-overlay border border-line flex items-center justify-center shrink-0">
        {transfer.direction === "upload" ? (
          <ArrowUp className="w-4 h-4 text-signal" strokeWidth={2} />
        ) : (
          <ArrowDown className="w-4 h-4 text-link" strokeWidth={2} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <p className="text-sm text-ink truncate">{transfer.fileName}</p>
          <span className={`text-[11px] font-mono shrink-0 ${meta.class}`}>
            {meta.label}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all`}
            style={{ width: `${transfer.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[11px] text-ink-faint font-mono truncate">
            {transfer.peer} · {transfer.size}
          </p>
          <p className="text-[11px] text-ink-faint font-mono shrink-0">
            {transfer.status === "active"
              ? `${transfer.speed} · ${transfer.eta}`
              : transfer.eta}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {transfer.status === "active" && (
          <button className="p-1.5 text-ink-faint hover:text-ink transition-colors">
            <Pause className="w-3.5 h-3.5" />
          </button>
        )}
        {transfer.status === "failed" && (
          <button className="p-1.5 text-ink-faint hover:text-signal transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
        {transfer.status === "done" && (
          <span className="p-1.5 text-link">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
        {(transfer.status === "active" || transfer.status === "queued") && (
          <button className="p-1.5 text-ink-faint hover:text-danger transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
