// src/types.ts
export interface FileSnapshot {
  path: string;
  content: string;
}

export interface ScanOptions {
  extensions?: string[]; // ['.js', '.ts', '.css']
  // A opção 'ignore' foi movida para o arquivo de configuração e 'loadConfig'
}

export interface Config {
  ignore: string[]; // Patterns de arquivos/diretórios a ignorar
}
