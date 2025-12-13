// src/types.ts
export interface FileSnapshot {
  path: string;
  content: string;
}

export interface ScanOptions {
  extensions?: string[]; // ['.js', '.ts', '.css']
  ignore?: string[];
}
