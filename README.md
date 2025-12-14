# JohanKit

**JohanKit** is a developer-friendly CLI designed to supercharge your **vibe-coding** flow. It helps you capture, restore, and manipulate snapshots of your codebase, making it effortless to experiment, refactor, and collaborate—without locking you into a specific framework or workflow.

Think of it as your personal **code snapshot toolkit**: lightweight, fast, and agnostic.

---

## Why JohanKit?

The name combines:

- **Johan** – a nod to the “creator” or developer archetype.
- **Kit** – a set of practical tools.

JohanKit is a “kit for developers,” crafted to streamline coding sessions, prototype features quickly, and integrate seamlessly with AI-assisted refactoring or review tools.

---

## Features

### copy

Take a snapshot of files in a directory and copy it to your clipboard as JSON.

```bash
johankit copy <dir> [exts]
````

* `dir`: Directory to scan (default: current)
* `exts`: Comma-separated list of extensions (e.g., `ts,js`)

---

### paste

Restore files from a JSON snapshot stored in your clipboard.

```bash
johankit paste <dir>
```

* `dir`: Directory where files will be created (default: current)

---

### prompt

Generate a ready-to-use AI prompt including a snapshot of your codebase.

```bash
johankit prompt <dir> "<user request>"
```

* `dir`: Directory to scan (default: current)
* `<user request>`: Instruction for AI to apply on the snapshot

---

### sync

Apply JSON patches to your codebase and update the clipboard with the new snapshot.

```bash
johankit sync <dir>
```

* `dir`: Target directory (default: current)

---

## Example Workflow

```bash
# Copy snapshot of your current src
johankit copy src

# Ask AI to refactor your codebase
johankit prompt src "Convert all callbacks to async/await"

# Apply AI-suggested changes and update snapshot
johankit sync src
```

With just a few commands, JohanKit lets you **capture ideas, experiment safely, and sync changes instantly**.

---

## Configuration

You can configure defaults with a `johankit.yaml` file in the project root:

```yaml
ignore:
  - dist
  - node_modules
  - .git
```

This ensures you never accidentally snapshot unnecessary files.

---

## Requirements

* Node.js >= 14
* Clipboard-compatible OS (`xclip`, `pbcopy`, or `clip` on Windows)

---

## Installation

```bash
npm install -g johankit
```
