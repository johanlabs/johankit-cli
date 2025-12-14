import { DiffPatch } from "./diff";

function isValidPatch(patch: any): boolean {
  if (typeof patch !== "object" || patch === null) return false;
  if (typeof patch.path !== "string" || patch.path.length === 0) return false;

  const validTypes = ["modify", "create", "delete"];
  if (!validTypes.includes(patch.type)) return false;

  if (patch.type === "delete") {
    return patch.content === undefined;
  } else {
    return typeof patch.content === "string";
  }
}

export function validatePatches(patches: any): DiffPatch[] {
  if (!Array.isArray(patches)) {
    throw new Error("O patch deve ser um array JSON válido");
  }

  for (const [index, patch] of patches.entries()) {
    if (!isValidPatch(patch)) {
      throw new Error(`Patch inválido no índice ${index}: ${JSON.stringify(patch, null, 2)}.\nEsperado: { type: 'modify'|'create'|'delete', path: string, content?: string }`);
    }
  }

  return patches as DiffPatch[];
}