// src/core/validation.ts
import { validatePatches as sharedValidate } from "./schema";

export function validatePatches(json: any): any[] {
  return sharedValidate(json);
}