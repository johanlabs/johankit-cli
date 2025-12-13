"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const scan_1 = require("../../core/scan");
const clipboard_1 = require("../../core/clipboard");
function copy(dir) {
    const snapshot = (0, scan_1.scanDir)(dir);
    const clipboardJSON = JSON.stringify(snapshot, null, 2); // <- garante JSON válido
    (0, clipboard_1.copyToClipboard)(clipboardJSON);
}
exports.copy = copy;
