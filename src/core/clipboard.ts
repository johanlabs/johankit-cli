// src/core/clipboard.ts
import { spawn } from "child_process";
import clipboardy from "clipboardy";

export async function copyToClipboard(text: string): Promise<void> {
  const platform = process.platform;
  
  const isWSL = process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP;

  return new Promise((resolve, reject) => {
    let command = "";
    let args: string[] = [];

    if (isWSL) {
      command = "clip.exe";
    } else if (platform === "darwin") {
      command = "pbcopy";
    } else if (platform === "win32") {
      command = "clip";
    } else {
      command = "xclip";
      args = ["-selection", "clipboard"];
    }

    try {
      const child = spawn(command, args);
      
      child.on("error", (err) => reject(err));
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Clipboard error: ${code}`));
      });

      child.stdin.write(text);
      child.stdin.end();
    } catch (e) {
      reject(e);
    }
  });
}

export async function readClipboard(): Promise<string> {
  try {
    return await clipboardy.read();
  } catch (err) {
    return new Promise((resolve) => {
      const platform = process.platform;
      let command = platform === "darwin" ? "pbpaste" : platform === "win32" ? "powershell" : "xclip";
      let args = platform === "win32" ? ["-NoProfile", "-Command", "Get-Clipboard"] : 
                 platform === "linux" ? ["-selection", "clipboard", "-o"] : [];

      const child = spawn(command, args);
      let output = "";

      child.stdout.on("data", (d) => (output += d.toString()));
      child.on("close", () => resolve(output.trim()));
      child.on("error", () => resolve(""));
    });
  }
}