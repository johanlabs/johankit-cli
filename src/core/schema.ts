// src/core/schema.ts

export interface PatchItem {
  path?: string;
  content?: string | null;
  type?: 'console';
  command?: string;
}

export function validatePatches(json: any): PatchItem[] {
  if (!Array.isArray(json)) {
    throw new Error("Input must be a valid JSON array");
  }
  return json.filter(item => 
    (item.path) || (item.type === 'console' && item.command)
  );
}