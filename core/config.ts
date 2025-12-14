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