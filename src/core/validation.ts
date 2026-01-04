// src/core/validation.ts
import { DiffPatch } from "./diff";

export function validatePatches(json: any): any[] {
  if (!Array.isArray(json)) {
    throw new Error("Validation Error: Input is not a JSON array.");
  }
  return json;
}