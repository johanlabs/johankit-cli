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
  // Validação permissiva: ou tem path (arquivo) ou tem type console + command
  return json.map((item, index) => {
    const isFile = typeof item.path === 'string';
    const isCommand = item.type === 'console' && typeof item.command === 'string';

    if (!isFile && !isCommand) {
      throw new Error(`Item at index ${index} is invalid. Must have 'path' or 'type: console'`);
    }
    return item as PatchItem;
  });
}