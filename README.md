# JohanKit

JohanKit is a command-line tool for copying, pasting, generating prompts, and syncing code snapshots.

## Installation

`bash
npm install -g johankit
`

## Commands

### copy
Copies files from a directory to the clipboard in JSON format.

`bash
johankit copy <dir> [exts]
`
- `dir`: Directory to scan (default: current)
- `exts`: Comma-separated list of extensions (e.g., `ts,js`)

### paste
Restores files from JSON in the clipboard.

`bash
johankit paste <dir>
`
- `dir`: Directory where files will be created (default: current)

### prompt
Generates a complete AI prompt with a directory snapshot.

`bash
johankit prompt <dir> "<user request>"
`
- `dir`: Directory to scan (default: current)
- `<user request>`: Specific request for the AI to apply on the snapshot

### sync
Applies JSON patches to the directory and updates the clipboard with the new snapshot.

`bash
johankit sync <dir>
`
- `dir`: Target directory (default: current)

## Usage Example

`bash
johankit copy src
johankit prompt src "Refactor to async/await"
johankit sync src
`

## Configuration

JohanKit can use a `johankit.yaml` file in the base directory to configure defaults, such as ignored directories.

Example `johankit.yaml`:

`yaml
ignore:
  - dist
  - node_modules
  - .git
`

## Requirements

- Node.js >= 14
- Clipboard-compatible OS (`xclip`, `pbcopy`, or `clip`)

## License

ISC