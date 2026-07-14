"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, AlertTriangle, FolderOpen } from "lucide-react";
import Topbar from "@/components/Topbar";
import FileRow from "@/components/FileRow";
import type { ApiFile } from "@/types/alltypes";
import { getFiles } from "@/lib/api";

// export default function FilesPage() {
//   //   const [file, setFile] = useState([]);
//   const handleFiles = async () => {
//     const response = await fetch("http://172.19.4.34:5000/files", {
//       method: "GET",
//     });
//     if (!response.ok) throw new Error("Failed to fetch files");
//     const data = await response.json();
//     console.log(data);
//     // setFile(data);
//   };
//   return (
//     <div>
//       <h1>File Page</h1>
//       <button onClick={handleFiles}>Happy</button>
//       {/* <div>{file}</div> */}
//     </div>
//   );
// }

export default function FilesPage() {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const randomInfo = (id: number, nam: string) => {
    return {
      id: id.toString(),
      name: nam,
      size: Math.floor(Math.random() * 10),
      type: "jpg",
      uploadedAt: String(new Date()),
      uploadedBy: "Amit",
    };
  };

  useEffect(() => {
    console.log("UseEffect running for client status check.");
    let cancelled = false;
    setLoading(true);
    // getFiles().then((data) => {
    //   console.log("API response:", data);
    //   console.log("Is array?", Array.isArray(data["files"]), data["files"]);
    //   const ary = data["files"];
    //   console.log(ary.length);
    //   ary.forEach((element: string) => console.log(element));
    // });
    const apiObj: ApiFile[] = [];
    getFiles()
      .then((data) => {
        if (!cancelled) {
          //   setFiles(data["files"]);
          data["files"].forEach((element: string, key: number) => {
            apiObj.push(randomInfo(key, element));
          });
          setFiles(apiObj);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled)
          setError("Couldn't reach the server. Is your backend running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return files;
    const q = query.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  const handleDeleted = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <>
      <Topbar
        title="Files"
        subtitle={
          loading ? "Loading…" : `${files.length} files on this network`
        }
      />

      <main className="flex-1 px-4 md:px-8 py-6 space-y-4 max-w-[1400px] w-full">
        <div className="flex items-center gap-2 bg-bg-overlay border border-line rounded-md px-3 h-10 max-w-sm">
          <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none w-full"
          />
        </div>

        <div className="rounded-lg border border-line bg-bg-raised overflow-hidden">
          <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_110px_90px_auto] gap-4 px-4 py-2.5 border-b border-line bg-bg-overlay/40">
            <span className="text-[11px] uppercase tracking-wider text-ink-faint font-mono">
              Name
            </span>
            <span className="text-[11px] uppercase tracking-wider text-ink-faint font-mono">
              Size
            </span>
            <span className="text-[11px] uppercase tracking-wider text-ink-faint font-mono">
              Uploaded
            </span>
            <span className="text-[11px] uppercase tracking-wider text-ink-faint font-mono text-right">
              Actions
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink-faint">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-sm">Fetching files…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <p className="text-sm text-ink">{error}</p>
              <p className="text-xs text-ink-faint">
                Check NEXT_PUBLIC_API_URL in your .env.local
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
              <FolderOpen className="w-5 h-5 text-ink-faint" />
              <p className="text-sm text-ink">
                {query ? "No files match your search" : "No files shared yet"}
              </p>
              {!query && (
                <p className="text-xs text-ink-faint">
                  Files uploaded on this network will show up here
                </p>
              )}
            </div>
          ) : (
            <div>
              {Array.isArray(filtered)
                ? filtered.map((f, idx) => (
                    <FileRow key={idx} file={f} onDeleted={handleDeleted} />
                  ))
                : null}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
