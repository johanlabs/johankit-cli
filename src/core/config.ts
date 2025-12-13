// src/core/config.ts
import path from "path";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { Config } from "../types";

const CONFIG_FILENAME = "johankit.yaml";
const DEFAULT_IGNORE = [
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "tmp",
  "temp",
];

/**
 * Tenta carregar as configurações do arquivo johankit.yaml na basePath.
 * Retorna um objeto Config com defaults se o arquivo não for encontrado.
 * @param basePath O diretório base para procurar o arquivo de configuração.
 * @returns O objeto de configuração.
 */
export function loadConfig(basePath: string): Config {
  const configPath = path.join(basePath, CONFIG_FILENAME);

  try {
    const content = readFileSync(configPath, "utf8");
    const loadedConfig = load(content) as Partial<Config>;

    return {
      ignore: [
        ...DEFAULT_IGNORE,
        ...(loadedConfig.ignore || []),
      ],
    };
  } catch (error) {
    if (error instanceof Error && (error as any).code === "ENOENT") {
      // Arquivo não encontrado, retorna configuração padrão
      return {
        ignore: DEFAULT_IGNORE,
      };
    }

    console.warn(`[johankit] Aviso: Falha ao carregar ${CONFIG_FILENAME}. Usando defaults.`, error);
    return {
      ignore: DEFAULT_IGNORE,
    };
  }
}
