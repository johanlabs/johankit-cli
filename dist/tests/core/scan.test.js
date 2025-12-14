"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scan_1 = require("../../../core/scan");
const fs_1 = __importDefault(require("fs"));
jest.mock('fs');
describe('scanDir', () => {
    it('should scan files with default ignores', () => {
        fs_1.default.readdirSync.mockReturnValue([{ name: 'a.txt', isDirectory: () => false }]);
        fs_1.default.readFileSync.mockReturnValue('content');
        const files = (0, scan_1.scanDir)('.');
        expect(files[0].path).toBe('a.txt');
    });
});
