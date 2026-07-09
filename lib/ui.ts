import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import type { DeviceStatus } from "./mock-data";

export const deviceIcon = {
  desktop: Monitor,
  laptop: Laptop,
  phone: Smartphone,
  tablet: Tablet,
} as const;

export const statusColor: Record<DeviceStatus, string> = {
  online: "bg-link",
  idle: "bg-signal",
  offline: "bg-ink-faint",
};

export const statusLabel: Record<DeviceStatus, string> = {
  online: "Online",
  idle: "Idle",
  offline: "Offline",
};
