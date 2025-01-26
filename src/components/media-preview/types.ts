export interface Media {
  id: string;
  mimeType: string;
  src?: string | null;
  height?: number | null;
  width?: number | null;
}

export interface MediaImage {
  id: string;
  mimeType: string;
  src?: string | null;
  height: number;
  width: number;
}
