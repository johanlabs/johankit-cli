// src/core/schema.ts
import { DiffPatch } from "./diff";

function isValidPatch(patch: any): boolean {
  if (typeof patch !== "object" || patch === null) return false;
  if (typeof patch.path !== "string" || patch.path.length === 0) return false;

  const validTypes = ["modify", "create", "delete", "console"];
  if (patch.type && !validTypes.includes(patch.type)) return false;

  return true;
}

export function validatePatches(patches: any): (DiffPatch | { type: 'console', command: string })[] {
  if (!Array.isArray(patches)) {
    throw new Error("Input must be a valid JSON array");
  }

  for (const [index, patch] of patches.entries()) {
    if (!isValidPatch(patch)) {
      throw new Error(`Invalid patch at index ${index}`);
    }
  }

  return patches;
}