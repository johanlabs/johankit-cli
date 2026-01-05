// src/core/clipboard.ts
import { spawn } from "child_process";

export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command = "xclip";
    let args = ["-selection", "clipboard"];

    if (platform === "darwin") {
      command = "pbcopy";
      args = [];
    } else if (platform === "win32") {
      command = "clip";
      args = [];
    }

    const child = spawn(command, args);
    child.on("error", (err) => reject(err));
    child.on("close", () => resolve());

    child.stdin.write(text);
    child.stdin.end();
  });
}

export function readClipboard(): Promise<string> {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let command = "xclip";
    let args = ["-selection", "clipboard", "-o"];

    if (platform === "darwin") {
      command = "pbpaste";
      args = [];
    } else if (platform === "win32") {
      command = "powershell";
      args = ["-NoProfile", "-Command", "Get-Clipboard"];
    }

    const child = spawn(command, args);
    let output = "";
    let error = "";

    child.stdout.on("data", (d) => (output += d.toString()));
    child.stderr.on("data", (d) => (error += d.toString()));

    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code !== 0 && error && !output) {
        reject(new Error(error || "Clipboard read failed"));
      } else {
        resolve(output.trim().replace(/^\uFEFF/, ""));
      }
    });
  });
}