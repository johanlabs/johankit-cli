// src/types.ts
export interface FileSnapshot {
  path: string;
  content: string;
  type?: "modify" | "create" | "delete";
}

export interface ScanOptions {
  extensions?: string[]; // ['.js', '.ts', '.css']
  ignore?: string[];
}
