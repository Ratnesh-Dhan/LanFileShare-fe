"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Check, AlertTriangle } from "lucide-react";
import { uploadFileWithProgress } from "@/lib/api";
import { networkInfo } from "@/lib/mock-data";
import { UploadItem } from "@/types/alltypes";

export default function UploadZone({
  onUploaded,
}: {
  onUploaded?: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    const newItems: UploadItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      progress: 0,
      status: "uploading",
    }));
    setItems((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      uploadFileWithProgress(item.file, (percent) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress: percent } : i)),
        );
      })
        .then(() => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "done", progress: 100 } : i,
            ),
          );
          onUploaded?.();
        })
        .catch(() => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: "error" } : i)),
          );
        });
    });
  }

  function dismiss(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
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
            <span className="text-signal font-medium">{networkInfo.ssid}</span>
          </p>
          <p className="text-xs text-ink-faint mt-1">
            or browse to select files from this device
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-1 text-sm font-medium text-bg bg-signal px-4 py-2 rounded-md hover:bg-signal/90 transition-colors"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ""; // reset so selecting the same file again still fires onChange
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="rounded-lg border border-line bg-bg-raised divide-y divide-line-soft">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-sm text-ink truncate">{item.file.name}</p>
                  {item.status === "uploading" && (
                    <span className="text-[11px] font-mono text-ink-faint shrink-0">
                      {item.progress}%
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === "error"
                        ? "bg-danger"
                        : item.status === "done"
                          ? "bg-link"
                          : "bg-signal"
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              {item.status === "done" && (
                <Check className="w-4 h-4 text-link shrink-0" />
              )}
              {item.status === "error" && (
                <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
              )}
              <button
                onClick={() => dismiss(item.id)}
                className="text-ink-faint hover:text-ink transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
