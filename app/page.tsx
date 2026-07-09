"use client";
import { Router, ArrowDownUp, HardDrive, Wifi } from "lucide-react";
import Topbar from "@/components/Topbar";
import NetworkMap from "@/components/NetworkMap";
import StatCard from "@/components/StatCard";
import UploadZone from "@/components/UploadZone";
import TransferRow from "@/components/TransferRow";
import { networkInfo, transfers } from "@/lib/mock-data";
// import { getFiles } from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const activeTransfers = transfers.filter(
    (t) => t.status === "active" || t.status === "queued",
  );

  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetch("http://172.19.4.34:5000/files", { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        console.log("this is our files");
        console.log(res.json());
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle={`This device · ${networkInfo.thisDeviceIp}`}
      />

      <main className="flex-1 px-4 md:px-8 py-6 space-y-6 max-w-[1400px] w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Devices online"
            value={`${networkInfo.onlineCount}/${networkInfo.totalCount}`}
            detail="On this subnet"
            icon={Router}
            accent="link"
          />
          <StatCard
            label="Active transfers"
            value={String(activeTransfers.length)}
            detail="2 sending · 1 queued"
            icon={ArrowDownUp}
            accent="signal"
          />
          <StatCard
            label="Shared today"
            value="2.4 GB"
            detail="Across 7 files"
            icon={HardDrive}
          />
          <StatCard
            label="Network"
            value={networkInfo.ssid.split(" ")[0]}
            detail={networkInfo.subnet}
            icon={Wifi}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <div className="rounded-lg border border-line bg-bg-raised p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-sm font-semibold text-ink">
                Local network
              </h2>
              <span className="text-[11px] font-mono text-ink-faint">
                {networkInfo.subnet}
              </span>
            </div>
            <p className="text-xs text-ink-faint mb-2">
              Live topology of devices reachable on your LAN right now
            </p>
            <NetworkMap />
          </div>

          <div className="rounded-lg border border-line bg-bg-raised flex flex-col">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
              <h2 className="font-display text-sm font-semibold text-ink">
                Active transfers
              </h2>
              <a
                href="/transfers"
                className="text-[11px] font-mono text-link hover:underline"
              >
                View all
              </a>
            </div>
            <div className="flex-1">
              {activeTransfers.map((t) => (
                <TransferRow key={t.id} transfer={t} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <div>
            <h2 className="font-display text-sm font-semibold text-ink mb-3">
              Share a file
            </h2>
            <UploadZone />
          </div>

          <div className="rounded-lg border border-line bg-bg-raised flex flex-col">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
              <h2 className="font-display text-sm font-semibold text-ink">
                Recent files
              </h2>
              <a
                href="/files"
                className="text-[11px] font-mono text-link hover:underline"
              >
                View all
              </a>
            </div>
            <div>
              {/* {files.map((f) => (
                <div
                  key={f.id}
                  className="px-4 py-3 border-b border-line-soft last:border-0 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{f.name}</p>
                    <p className="text-[11px] text-ink-faint font-mono">
                      {f.size} · {f.sharedAt}
                    </p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
