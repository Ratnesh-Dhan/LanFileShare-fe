"use client";

import { useState } from "react";
import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileArchive,
  FileCode,
  File as FileIcon,
  Download,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";
import type { ApiFile } from "@/types/alltypes";
import { formatBytes, formatRelativeTime } from "@/lib/format";
import { deleteFile, downloadFile } from "@/lib/api";

function renderFileIcon(type: string, className: string) {
  const props = { className, strokeWidth: 1.75 };
  if (type.startsWith("image/")) return <FileImage {...props} />;
  if (type.startsWith("video/")) return <FileVideo {...props} />;
  if (type.startsWith("audio/")) return <FileAudio {...props} />;
  if (
    type.includes("zip") ||
    type.includes("archive") ||
    type.includes("compressed")
  )
    return <FileArchive {...props} />;
  if (
    type.includes("pdf") ||
    type.includes("text") ||
    type.includes("document")
  )
    return <FileText {...props} />;
  if (
    type.includes("json") ||
    type.includes("javascript") ||
    type.includes("code")
  )
    return <FileCode {...props} />;
  return <FileIcon {...props} />;
}

function tintFor(type: string) {
  if (type.startsWith("image/") || type.startsWith("audio/"))
    return "text-link";
  if (
    type.startsWith("video/") ||
    type.includes("zip") ||
    type.includes("archive")
  )
    return "text-signal";
  return "text-ink-muted";
}

export default function FileRow({
  file,
  onDeleted,
}: {
  file: ApiFile;
  onDeleted: (id: string) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    try {
      const blob = await downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 1500);
    } catch {
      setError("Download failed");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteFile(file.name);
      onDeleted(file.id);
    } catch {
      setError("Delete failed");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_110px_90px_auto] items-center gap-4 px-4 py-3 border-b border-line-soft last:border-0 hover:bg-bg-overlay/50 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md bg-bg-overlay border border-line flex items-center justify-center shrink-0">
          {renderFileIcon(file.type, `w-4 h-4 ${tintFor(file.type)}`)}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-ink truncate">{file.name}</p>
          <p className="text-[11px] text-ink-faint font-mono truncate">
            {formatBytes(file.size)} · {formatRelativeTime(file.uploadedAt)}
            {file.ip ? ` · ${file.ip}` : ""}
            {error && <span className="text-danger"> · {error}</span>}
          </p>
        </div>
      </div>

      <p className="hidden sm:block text-xs text-ink-faint font-mono">
        {formatBytes(file.size)}
      </p>
      <p className="hidden sm:block text-xs text-ink-faint font-mono">
        {formatRelativeTime(file.uploadedAt)}
      </p>

      <div className="flex items-center justify-end gap-1.5">
        {confirmingDelete ? (
          <>
            <span className="text-[11px] text-ink-faint font-mono hidden sm:inline">
              Delete?
            </span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-[11px] font-mono px-2 py-1 rounded-md bg-danger-soft text-danger border border-danger/40 hover:bg-danger/20 transition-colors disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="text-[11px] font-mono px-2 py-1 rounded-md text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-1.5 text-ink-faint hover:text-link transition-colors disabled:opacity-60"
              title="Download"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloaded ? (
                <Check className="w-3.5 h-3.5 text-link" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="p-1.5 text-ink-faint hover:text-danger transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
