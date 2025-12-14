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
const sync_1 = require("../../../cli/commands/sync");
const scan = __importStar(require("../../../core/scan"));
const clipboard = __importStar(require("../../../core/clipboard"));
const diff = __importStar(require("../../../core/diff"));
const validation = __importStar(require("../../../core/validation"));
jest.mock('../../../core/scan');
jest.mock('../../../core/clipboard');
jest.mock('../../../core/diff');
jest.mock('../../../core/validation');
describe('sync', () => {
    it('should apply patches and update clipboard', async () => {
        scan.scanDir.mockReturnValue([]);
        clipboard.copyToClipboard.mockResolvedValue(undefined);
        validation.validatePatches.mockImplementation(p => p);
        const input = JSON.stringify([{ type: 'create', path: 'a.txt', content: 'x' }]);
        process.stdin.push(input);
        process.stdin.push(null);
        await (0, sync_1.sync)('.');
        expect(diff.applyDiff).toHaveBeenCalled();
        expect(clipboard.copyToClipboard).toHaveBeenCalledTimes(2);
    });
});
