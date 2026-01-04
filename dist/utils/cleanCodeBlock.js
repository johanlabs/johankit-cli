"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cleanCodeBlock;
function cleanCodeBlock(content) {
    const langMatch = content.match(/^```(\w+)?/);
    const lang = langMatch ? langMatch[1] : null;
    let cleaned = content.replace(/^\uFEFF/, '');
    cleaned = cleaned.replace(/^```(\w+)?\s*/, '').replace(/```$/, '');
    cleaned = cleaned.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');
    cleaned = cleaned.trim();
    return { lang, cleaned };
}
