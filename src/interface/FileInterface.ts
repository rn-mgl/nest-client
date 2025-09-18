export interface CloudFileInterface {
  disk: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
}

export interface RawFileInterface {
  rawFile: File;
  fileURL: string;
}
