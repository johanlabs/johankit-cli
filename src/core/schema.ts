// src/core/schema.ts
import { DiffPatch } from "./diff";

/**
 * Valida se um objeto se parece com um Patch de DiffPatch válido.
 * Não faz validação completa de esquema (JSON Schema), mas verifica a estrutura básica.
 */
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

/**
 * Valida um array de patches de diff (DiffPatch[]).
 * @param patches O array a ser validado.
 * @returns O array de patches se for válido.
 * @throws Um erro se a validação falhar.
 */
export function validatePatches(patches: any): DiffPatch[] {
  if (!Array.isArray(patches)) {
    throw new Error("O patch deve ser um array JSON válido");
  }

  for (const [index, patch] of patches.entries()) {
    if (!isValidPatch(patch)) {
      throw new Error(`Patch inválido no índice ${index}: ${JSON.stringify(patch, null, 2)}.\nEsperado: { type: 'modify'|'create'|'delete', path: string, content?: string }`);
    }
  }

  // Assume que o array validado está no formato correto de DiffPatch[]
  return patches as DiffPatch[];
}
