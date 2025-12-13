"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const scan_1 = require("../../core/scan");
const clipboard_1 = require("../../core/clipboard");
function copy(input) {
    let snapshot;
    if (Array.isArray(input)) {
        snapshot = input.map(path => {
            const fileSnapshot = (0, scan_1.scanDir)(path);
            if (fileSnapshot.length !== 1) {
                throw new Error(`Expected single file for path: ${path}`);
            }
            return fileSnapshot[0];
        });
    }
    else {
        const stat = (0, scan_1.scanDir)(input);
        snapshot = stat.length === 1 ? stat : (0, scan_1.scanDir)(input);
    }
    const clipboardJSON = JSON.stringify(snapshot, null, 2); // <- garante JSON válido
    (0, clipboard_1.copyToClipboard)(clipboardJSON);
}
exports.copy = copy;
