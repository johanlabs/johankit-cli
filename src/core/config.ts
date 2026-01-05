import path from "path";
import { readFileSync, existsSync } from "fs";
import { load } from "js-yaml";
import { Config } from "../types";

const DEFAULT_IGNORE = [
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "tmp",
  "temp",
];

export function loadConfig(basePath: string): Config {
  // Lista de possíveis nomes para o arquivo de configuração
  const configFilenames = ["johankit.yaml", "johankit.yml"];
  let loadedConfig: Partial<Config> = {};

  for (const filename of configFilenames) {
    const configPath = path.join(basePath, filename);
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf8");
        loadedConfig = (load(content) as Partial<Config>) || {};
        break; // Para no primeiro que encontrar
      } catch (error) {
        console.warn(`[johankit] Erro ao ler ${filename}, tentando próximo...`);
      }
    }
  }

  // Set para garantir que não existam duplicatas nos padrões de ignore
  const ignoreSet = new Set([...DEFAULT_IGNORE, ...(loadedConfig.ignore || [])]);

  return {
    ignore: Array.from(ignoreSet),
  };
}