"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diff_1 = require("../../../core/diff");
const fs_1 = __importDefault(require("fs"));
jest.mock('fs');
describe('applyDiff', () => {
    it('should handle create and modify', () => {
        const patches = [
            { type: 'create', path: 'a.txt', content: 'x' },
            { type: 'modify', path: 'b.txt', content: 'y' }
        ];
        (0, diff_1.applyDiff)('.', patches);
        expect(fs_1.default.writeFileSync).toHaveBeenCalledTimes(2);
    });
    it('should handle delete', () => {
        fs_1.default.existsSync.mockReturnValue(true);
        const patches = [{ type: 'delete', path: 'c.txt' }];
        (0, diff_1.applyDiff)('.', patches);
        expect(fs_1.default.unlinkSync).toHaveBeenCalledWith('./c.txt');
    });
});
