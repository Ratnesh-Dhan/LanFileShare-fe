"use client";

import { devices as allDevices } from "@/lib/mock-data";
import { deviceIcon } from "@/lib/ui";

const CX = 320;
const CY = 200;
const MAX_R = 168;
const MIN_R = 78;

const angleFor: Record<string, number> = {
  "dev-2": -50,
  "dev-3": 18,
  "dev-4": 92,
  "dev-5": 158,
  "dev-6": -138,
};

const activeTransferPeers = new Set(["dev-2", "dev-4"]);

export default function NetworkMap() {
  const peers = allDevices.filter((d) => d.id !== "dev-1");

  const round = (n: number) => Math.round(n * 100) / 100;

  const nodes = peers.map((d) => {
    const angle = (angleFor[d.id] ?? 0) * (Math.PI / 180);
    const r =
      d.status === "offline"
        ? MAX_R
        : MAX_R - (d.signal / 100) * (MAX_R - MIN_R);
    return {
      ...d,
      x: round(CX + r * Math.cos(angle)),
      y: round(CY + r * Math.sin(angle)),
    };
  });

  return (
    <div className="relative w-full aspect-[16/9] max-h-[420px]">
      <svg viewBox="0 0 640 400" className="w-full h-full">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9F1C" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FF9F1C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {[MIN_R, (MIN_R + MAX_R) / 2, MAX_R].map((r) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="#1D2225"
            strokeWidth={1}
          />
        ))}

        <circle cx={CX} cy={CY} r={MAX_R + 40} fill="url(#hubGlow)" />

        {nodes.map((n) => {
          const active =
            activeTransferPeers.has(n.id) && n.status !== "offline";
          const isOffline = n.status === "offline";
          return (
            <line
              key={`line-${n.id}`}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke={active ? "#3FB8AF" : isOffline ? "#20262A" : "#2A3033"}
              strokeWidth={active ? 1.75 : 1.25}
              strokeDasharray={active ? "5 5" : isOffline ? "2 4" : "0"}
              className={active ? "animate-dash-flow" : ""}
            />
          );
        })}

        {nodes.map((n) => {
          const active =
            activeTransferPeers.has(n.id) && n.status !== "offline";
          const isOffline = n.status === "offline";
          return (
            <g key={n.id}>
              {active && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={16}
                  fill="none"
                  stroke="#3FB8AF"
                  strokeWidth={1.5}
                  className="animate-pulse-ring"
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={15}
                fill={isOffline ? "#171B1E" : "#1E2326"}
                stroke={active ? "#3FB8AF" : isOffline ? "#262C2F" : "#333B3E"}
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        <circle
          cx={CX}
          cy={CY}
          r={26}
          fill="#1E2326"
          stroke="#FF9F1C"
          strokeWidth={1.75}
        />
        <circle cx={CX} cy={CY} r={5} fill="#FF9F1C" />
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: `${(CX / 640) * 100}%`, top: `${(CY / 400) * 100}%` }}
        >
          <p className="mt-9 font-mono text-[11px] text-signal whitespace-nowrap">
            This device
          </p>
        </div>
        {nodes.map((n) => {
          const Icon = deviceIcon[n.kind];
          const isOffline = n.status === "offline";
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
              style={{
                left: `${(n.x / 640) * 100}%`,
                top: `${(n.y / 400) * 100}%`,
              }}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isOffline ? "text-ink-faint" : "text-ink"}`}
                strokeWidth={2}
              />
              <p
                className={`mt-7 font-mono text-[10px] whitespace-nowrap ${isOffline ? "text-ink-faint" : "text-ink-muted"}`}
              >
                {n.name.split(" ").slice(0, 2).join(" ")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
