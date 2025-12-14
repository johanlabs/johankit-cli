# JohanKit CLI

JohanKit é uma ferramenta para copiar, colar e sincronizar snapshots de código de forma inteligente usando AI.

## Comandos

### Copy
Copia um diretório ou arquivos específicos para o clipboard em formato JSON.

```bash
johankit copy <dir> [exts]
```

- `<dir>`: Diretório a copiar (padrão `.`)
- `[exts]`: Extensões separadas por vírgula (ex: `ts,js`)

### Paste
Aplica o conteúdo do clipboard em um diretório.

```bash
johankit paste <dir>
```

- `<dir>`: Diretório de destino (padrão `.`)

### Prompt
Gera um prompt com o snapshot atual do diretório para AI, copiando para o clipboard.

```bash
johankit prompt <dir> "<user request>"
```

### Sync
Aplica patches gerados pela AI em um diretório e atualiza o clipboard com o novo snapshot.

```bash
johankit sync <dir>
```

## Exemplo de Uso

```bash
johankit prompt src "refatorar para async/await"
johankit sync src
```

## Configuração
Crie um arquivo `johankit.yaml` na raiz do projeto para customizar os diretórios e arquivos a ignorar.

```yaml
ignore:
  - dist
  - node_modules
```

Por padrão, os seguintes diretórios já são ignorados: `.git`, `node_modules`, `dist`, `build`, `coverage`, `tmp`, `temp`.