export type DeviceStatus = "online" | "idle" | "offline";

export interface Device {
  id: string;
  name: string;
  kind: "desktop" | "laptop" | "phone" | "tablet";
  ip: string;
  status: DeviceStatus;
  lastSeen: string;
  signal: number; // 0-100
  os: string;
}

export const devices: Device[] = [
  {
    id: "dev-1",
    name: "This Device — Aarav-PC",
    kind: "desktop",
    ip: "192.168.1.14",
    status: "online",
    lastSeen: "now",
    signal: 100,
    os: "Windows 11",
  },
  {
    id: "dev-2",
    name: "Priya's MacBook Air",
    kind: "laptop",
    ip: "192.168.1.22",
    status: "online",
    lastSeen: "now",
    signal: 88,
    os: "macOS 15",
  },
  {
    id: "dev-3",
    name: "Living Room iPad",
    kind: "tablet",
    ip: "192.168.1.31",
    status: "idle",
    lastSeen: "3 min ago",
    signal: 61,
    os: "iPadOS 18",
  },
  {
    id: "dev-4",
    name: "Rohan's Pixel 9",
    kind: "phone",
    ip: "192.168.1.45",
    status: "online",
    lastSeen: "now",
    signal: 74,
    os: "Android 15",
  },
  {
    id: "dev-5",
    name: "Studio Workstation",
    kind: "desktop",
    ip: "192.168.1.8",
    status: "offline",
    lastSeen: "1 hr ago",
    signal: 0,
    os: "Ubuntu 24.04",
  },
  {
    id: "dev-6",
    name: "Meera's ThinkPad",
    kind: "laptop",
    ip: "192.168.1.52",
    status: "idle",
    lastSeen: "12 min ago",
    signal: 43,
    os: "Windows 11",
  },
];

export type FileKind =
  | "image"
  | "video"
  | "audio"
  | "doc"
  | "archive"
  | "code"
  | "other";

export interface SharedFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  from: string;
  to?: string;
  sharedAt: string;
  status: "available" | "sending" | "received";
}

export const files: SharedFile[] = [
  {
    id: "f-1",
    name: "Q3-brand-assets.zip",
    kind: "archive",
    size: "482 MB",
    from: "This Device",
    to: "All devices",
    sharedAt: "2 min ago",
    status: "available",
  },
  {
    id: "f-2",
    name: "site-launch-recording.mp4",
    kind: "video",
    size: "1.2 GB",
    from: "Priya's MacBook Air",
    to: "This Device",
    sharedAt: "14 min ago",
    status: "received",
  },
  {
    id: "f-3",
    name: "product-shots-final",
    kind: "image",
    size: "96 MB",
    from: "This Device",
    to: "Rohan's Pixel 9",
    sharedAt: "26 min ago",
    status: "available",
  },
  {
    id: "f-4",
    name: "roadmap-2026.pdf",
    kind: "doc",
    size: "3.4 MB",
    from: "Meera's ThinkPad",
    to: "This Device",
    sharedAt: "1 hr ago",
    status: "received",
  },
];

export interface Transfer {
  id: string;
  fileName: string;
  size: string;
  peer: string;
  direction: "upload" | "download";
  progress: number; // 0-100
  speed: string;
  eta: string;
  status: "active" | "queued" | "paused" | "done" | "failed";
}

export const transfers: Transfer[] = [
  {
    id: "t-1",
    fileName: "site-launch-recording.mp4",
    size: "1.2 GB",
    peer: "Priya's MacBook Air",
    direction: "download",
    progress: 64,
    speed: "38.2 MB/s",
    eta: "12s left",
    status: "active",
  },
  {
    id: "t-2",
    fileName: "product-shots-final.zip",
    size: "96 MB",
    peer: "Rohan's Pixel 9",
    direction: "upload",
    progress: 31,
    speed: "19.6 MB/s",
    eta: "3s left",
    status: "active",
  },
  {
    id: "t-3",
    fileName: "podcast-ep-014-raw.wav",
    size: "640 MB",
    peer: "Studio Workstation",
    direction: "upload",
    progress: 0,
    speed: "—",
    eta: "queued",
    status: "queued",
  },
];

export const networkInfo = {
  ssid: "Aarav's Network 5G",
  subnet: "192.168.1.0/24",
  gateway: "192.168.1.1",
  thisDeviceIp: "192.168.1.14",
  onlineCount: devices.filter((d) => d.status !== "offline").length,
  totalCount: devices.length,
};
