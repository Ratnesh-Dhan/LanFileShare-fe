export interface ApiFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  ip: string;
  type: string;
}

export interface UploadItem {
  id: string;
  name: string;
  size: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
}
