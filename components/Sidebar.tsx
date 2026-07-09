"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Router,
  Files,
  ArrowDownUp,
  Settings,
  Radio,
} from "lucide-react";
import { networkInfo } from "@/lib/mock-data";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/devices", label: "Devices", icon: Router },
  { href: "/files", label: "Files", icon: Files },
  { href: "/transfers", label: "Transfers", icon: ArrowDownUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-line bg-bg-raised shrink-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
        <div className="relative w-8 h-8 rounded-md bg-signal-soft border border-signal-dim flex items-center justify-center">
          <Radio className="w-4 h-4 text-signal" strokeWidth={2.25} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-link ring-2 ring-bg-raised" />
        </div>
        <p className="font-display font-semibold text-[15px] tracking-tight text-ink">
          LanShare
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-bg-overlay text-ink"
                  : "text-ink-muted hover:text-ink hover:bg-bg-overlay/60"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-signal" />
              )}
              <Icon
                className="w-[17px] h-[17px]"
                strokeWidth={active ? 2.25 : 2}
              />
              <span className={active ? "font-medium" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-line">
        <div className="rounded-lg bg-bg-overlay border border-line p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-ink-faint font-mono">
              Network
            </span>
            <span className="flex items-center gap-1 text-[11px] text-link font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-link animate-blink" />
              {networkInfo.onlineCount}/{networkInfo.totalCount}
            </span>
          </div>
          <p className="text-xs text-ink truncate">{networkInfo.ssid}</p>
          <p className="text-[11px] text-ink-faint font-mono mt-0.5">
            {networkInfo.thisDeviceIp}
          </p>
        </div>
      </div>
    </aside>
  );
}
