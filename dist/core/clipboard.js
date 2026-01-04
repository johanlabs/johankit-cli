"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyToClipboard = copyToClipboard;
exports.readClipboard = readClipboard;
// src/core/clipboard.ts
const child_process_1 = require("child_process");
function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        let command = "xclip";
        let args = ["-selection", "clipboard"];
        if (process.platform === "darwin") {
            command = "pbcopy";
            args = [];
        }
        else if (process.platform === "win32") {
            command = "clip";
            args = [];
        }
        const child = (0, child_process_1.spawn)(command, args, { stdio: ["pipe", "ignore", "ignore"] });
        child.on("error", (err) => reject(err));
        child.on("close", () => resolve());
        child.stdin.write(text);
        child.stdin.end();
    });
}
function readClipboard() {
    return new Promise((resolve, reject) => {
        let command = "xclip";
        let args = ["-selection", "clipboard", "-o"];
        if (process.platform === "darwin") {
            command = "pbpaste";
            args = [];
        }
        else if (process.platform === "win32") {
            command = "powershell";
            args = ["-command", "Get-Clipboard"];
        }
        const child = (0, child_process_1.spawn)(command, args, { stdio: ["ignore", "pipe", "pipe"] });
        let output = "";
        let error = "";
        child.stdout.on("data", (d) => (output += d.toString()));
        child.stderr.on("data", (d) => (error += d.toString()));
        child.on("error", (err) => reject(err));
        child.on("close", (code) => {
            if (code !== 0 && error && !output) {
                reject(new Error(error || "Clipboard read failed"));
            }
            else {
                resolve(output.trim().replace(/^\uFEFF/, ""));
            }
        });
    });
}
