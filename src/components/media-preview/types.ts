export interface Media {
  id: string;
  mimeType: string;
  src?: string;
  height?: number | null;
  width?: number | null;
}

export interface MediaImage {
  id: string;
  mimeType: string;
  src?: string;
  height: number;
  width: number;
}
