// src/core/validation.ts
import { validatePatches as sharedValidate } from "./schema";

/**
 * @deprecated Use validatePatches from core/schema instead.
 */
export function validatePatches(json: any): any[] {
  return sharedValidate(json);
}