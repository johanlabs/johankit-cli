import fs from "fs";
import path from "path";
import { FileSnapshot, ScanOptions, Config } from "../types";
import { loadConfig } from "./config";

export function scanDir(basePath: string, options: ScanOptions = {}): FileSnapshot[] {
  const result: FileSnapshot[] = [];
  const base = path.resolve(basePath);
  const exts = options.extensions?.map(e => e.startsWith('.') ? e : `.${e}`);

  const config: Config = loadConfig(base);
  const ignorePatterns = new Set(config.ignore);

  // Lê .gitignore e adiciona ao Set
  const gitignorePath = path.join(base, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    try {
      fs.readFileSync(gitignorePath, 'utf8')
        .split('\n')
        .forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            // Normaliza o caminho do gitignore para o padrão do scanner
            ignorePatterns.add(trimmed.replace(/^\//, '').replace(/\/$/, ''));
          }
        });
    } catch { }
  }

  // PERFORMANCE: Converte o Set em Array UMA VEZ antes de iniciar o loop
  const finalIgnoreList = Array.from(ignorePatterns);

  function loop(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const isBinary = entry.name.match(/\.(png|jpg|jpeg|gif|pdf|zip|exe|dll|so|db)$/i);
      if (isBinary) continue;

      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.relative(base, fullPath).replace(/\\/g, '/');

      // PERFORMANCE: O some() agora opera sobre um array fixo, sem Array.from() interno
      const shouldIgnore = finalIgnoreList.some(p =>
        relPath === p || relPath.startsWith(p + '/')
      );

      if (shouldIgnore) continue;

      if (entry.isDirectory()) {
        loop(fullPath);
      } else {
        if (exts && !exts.includes(path.extname(entry.name))) continue;

        try {
          // PERFORMANCE: Pular arquivos muito grandes evita travar o clipboard
          const stats = fs.statSync(fullPath);
          if (stats.size > 1024 * 300) continue; // Reduzi para 300KB para ser mais seguro

          result.push({
            path: relPath,
            content: fs.readFileSync(fullPath, 'utf8')
          });
        } catch (e) {
          continue;
        }
      }
    }
  }

  loop(base);
  return result;
}