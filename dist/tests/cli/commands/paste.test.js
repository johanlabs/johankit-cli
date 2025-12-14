"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const paste_1 = require("../../../cli/commands/paste");
const clipboard = __importStar(require("../../../core/clipboard"));
const write = __importStar(require("../../../core/write"));
jest.mock('../../../core/clipboard');
jest.mock('../../../core/write');
describe('paste', () => {
    it('should write files from clipboard JSON', async () => {
        clipboard.readClipboard.mockResolvedValue(JSON.stringify([{ path: 'a.txt', content: 'hi' }]));
        await (0, paste_1.paste)('dir');
        expect(write.writeFiles).toHaveBeenCalledWith('dir', [{ path: 'a.txt', content: 'hi' }], true);
    });
    it('should throw on invalid JSON', async () => {
        clipboard.readClipboard.mockResolvedValue('not json');
        await expect((0, paste_1.paste)('dir')).rejects.toThrow('Clipboard content is not valid JSON');
    });
});
