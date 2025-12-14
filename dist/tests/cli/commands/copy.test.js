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
const copy_1 = require("../../../cli/commands/copy");
const scan = __importStar(require("../../../core/scan"));
const clipboard = __importStar(require("../../../core/clipboard"));
jest.mock('../../core/scan');
jest.mock('../../core/clipboard');
describe('copy', () => {
    it('should copy single file snapshot to clipboard', () => {
        scan.scanDir.mockReturnValue([{ path: 'file.txt', content: 'hello' }]);
        (0, copy_1.copy)('file.txt');
        expect(clipboard.copyToClipboard).toHaveBeenCalledWith(JSON.stringify([{ path: 'file.txt', content: 'hello' }], null, 2));
    });
    it('should copy multiple file snapshots to clipboard', () => {
        scan.scanDir
            .mockReturnValueOnce([{ path: 'file1.txt', content: 'a' }])
            .mockReturnValueOnce([{ path: 'file2.txt', content: 'b' }]);
        (0, copy_1.copy)(['file1.txt', 'file2.txt']);
        expect(clipboard.copyToClipboard).toHaveBeenCalledWith(JSON.stringify([
            { path: 'file1.txt', content: 'a' },
            { path: 'file2.txt', content: 'b' }
        ], null, 2));
    });
});
