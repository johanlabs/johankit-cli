# JohanKit

JohanKit é uma ferramenta de linha de comando para copiar, colar, gerar prompts e sincronizar snapshots de código.

## Instalação

`bash
npm install -g johankit
`

## Comandos

### copy
Copia os arquivos de um diretório para a área de transferência em formato JSON.

`bash
tool copy <dir> [exts]
`
- `dir`: Diretório a ser escaneado (padrão: atual)
- `exts`: Lista de extensões separadas por vírgula (ex: `ts,js`)

### paste
Restaura arquivos a partir do JSON da área de transferência.

`bash
tool paste <dir>
`
- `dir`: Diretório onde os arquivos serão criados (padrão: atual)

### prompt
Gera um prompt completo para AI com snapshot do diretório.

`bash
tool prompt <dir> "<user request>"
`
- `dir`: Diretório a ser escaneado (padrão: atual)
- `<user request>`: Pedido específico que você quer que a AI execute sobre o snapshot

### sync
Aplica patches JSON no diretório e atualiza a área de transferência com o novo snapshot.

`bash
tool sync <dir>
`
- `dir`: Diretório alvo (padrão: atual)

## Exemplo de Uso

`bash
tool copy src
tool prompt src "Refatorar para async/await"
tool sync src
`

## Configuração

O JohanKit pode usar um arquivo `johankit.yaml` no diretório base para configurar padrões, como ignorar diretórios específicos.

Exemplo `johankit.yaml`:

`yaml
ignore:
  - dist
  - node_modules
  - .git
`

## Requisitos

- Node.js >= 14
- Sistema operacional compatível com clipboard (`xclip`, `pbcopy` ou `clip`)

## Licença

ISC