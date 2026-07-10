"use client";

import { useRef, useState } from "react";
import { Search, Upload, Menu, Loader2, Check } from "lucide-react";
import { uploadFileWithProgress } from "@/lib/api";

export default function Topbar({
  title,
  subtitle,
  onUploaded,
}: {
  title: string;
  subtitle?: string;
  onUploaded?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [justFinished, setJustFinished] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setUploadingCount((n) => n + files.length);

    files.forEach((file) => {
      uploadFileWithProgress(file, () => {})
        .then(() => onUploaded?.())
        .catch(() => {
          // Swallow here; FileRow/UploadZone surface detailed errors where relevant.
          // A toast system would be a good next addition for global upload failures.
        })
        .finally(() => {
          setUploadingCount((n) => n - 1);
          setJustFinished(true);
          setTimeout(() => setJustFinished(false), 1500);
        });
    });
  }

  return (
    <header className="h-16 border-b border-line bg-bg/95 backdrop-blur sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden text-ink-muted hover:text-ink">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold text-ink tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-ink-faint truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-bg-overlay border border-line rounded-md px-3 h-9 w-56 text-ink-faint focus-within:border-ink-faint transition-colors">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <input
            placeholder="Search files, devices…"
            className="bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none w-full"
          />
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploadingCount > 0}
          className="flex items-center gap-2 bg-signal text-bg font-medium text-sm px-3.5 h-9 rounded-md hover:bg-signal/90 active:bg-signal/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {uploadingCount > 0 ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : justFinished ? (
            <Check className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <Upload className="w-4 h-4" strokeWidth={2.5} />
          )}
          <span className="hidden sm:inline">
            {uploadingCount > 0 ? `Uploading ${uploadingCount}…` : "Share file"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </header>
  );
}
