// src/types.ts
export interface FileSnapshot {
  path: string;
  content: string | null;
}

export interface ScanOptions {
  extensions?: string[];
}

export interface Config {
  ignore: string[];
}