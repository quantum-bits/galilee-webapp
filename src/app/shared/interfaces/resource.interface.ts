export interface Resource {
  id: number;
  caption?: string;
  type: string;// 'image', 'video', etc.
  fileName: string;
  copyrightInfo?: string;
}
