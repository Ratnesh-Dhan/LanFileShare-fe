const BASE_URL = "http://172.19.4.34:5000";

export async function uploadFile(file: File, targetDeviceId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (targetDeviceId) formData.append("targetDeviceId", targetDeviceId);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getFiles() {
  const res = await fetch(`${BASE_URL}/files`);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
}

export async function downloadFile(fileId: string) {
  console.log(BASE_URL);
  const res = await fetch(`${BASE_URL}/download/${fileId}`);
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

export async function deleteFile(fileId: string) {
  const res = await fetch(`${BASE_URL}/delete/${fileId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
