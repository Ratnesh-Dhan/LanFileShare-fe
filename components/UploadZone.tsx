"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={`relative rounded-lg border border-dashed p-8 flex flex-col items-center justify-center text-center gap-3 transition-colors ${
        dragging
          ? "border-signal bg-signal-soft/40"
          : "border-line bg-bg-raised"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border ${
          dragging
            ? "border-signal bg-signal-soft"
            : "border-line bg-bg-overlay"
        }`}
      >
        <UploadCloud
          className={`w-5 h-5 ${dragging ? "text-signal" : "text-ink-muted"}`}
          strokeWidth={1.75}
        />
      </div>
      <div>
        <p className="text-sm text-ink">
          Drag files here to share on{" "}
          <span className="text-signal font-medium">
            Aarav&apos;s Network 5G
          </span>
        </p>
        <p className="text-xs text-ink-faint mt-1">
          or choose a device to send to directly
        </p>
      </div>
      <button className="mt-1 text-sm font-medium text-bg bg-signal px-4 py-2 rounded-md hover:bg-signal/90 transition-colors">
        Browse files
      </button>
    </div>
  );
}
