import { ApiFile, UploadItem } from "@/types/alltypes";

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

export function uploadFileWithProgress(
  item: UploadItem,
  onProgress: (precent: number) => void,
  targetDeviceId?: string,
): Promise<ApiFile> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("id", item.id);
    formData.append("name", item.name);
    formData.append("size", item.size);
    if (targetDeviceId) formData.append("targetDeviceId", targetDeviceId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/uploads`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.file);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
}

export async function getFiles() {
  const res = await fetch(`${BASE_URL}/files`);
  if (!res.ok) throw new Error("Failed to fetch files");
  const data = await res.json();
  return data;
}

export async function downloadFile(filename: string) {
  console.log(BASE_URL);
  console.log(filename);
  const res = await fetch(`${BASE_URL}/download/${filename}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

export async function deleteFile(fileName: string) {
  const res = await fetch(`${BASE_URL}/delete/${fileName}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
