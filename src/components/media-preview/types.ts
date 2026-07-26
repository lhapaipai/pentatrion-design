export interface BasicMedia {
  id: string;
  category: string;
  mimeType: string;
  width?: number;
  height?: number;
  src: string;
  srcSet?: string;
  sizes?: string;
}

export interface BasicMediaImage {
  id: string;
  category: string;
  mimeType: string;
  width: number;
  height: number;
  src: string;
  srcSet?: string;
  sizes?: string;
}
