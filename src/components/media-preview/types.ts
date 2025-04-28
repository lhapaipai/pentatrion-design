type MediaOrigin = "s3Upload" | "localUpload" | "external" | "asset";

export interface BasicMedia {
  id: string;
  origin: MediaOrigin;
  category: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  src?: string | null;
}

export interface BasicMediaImage {
  id: string;
  origin: MediaOrigin;
  category: string;
  mimeType: string;
  width: number;
  height: number;
  src?: string | null;
}
