type MediaOrigin = "s3Upload" | "localUpload" | "external" | "asset";

export interface Media {
  id: string;
  origin: MediaOrigin;
  category: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  src?: string | null;
}

export interface MediaImage {
  id: string;
  origin: MediaOrigin;
  category: string;
  mimeType: string;
  width: number;
  height: number;
  src?: string | null;
}
