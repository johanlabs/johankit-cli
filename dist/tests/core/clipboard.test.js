"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_1 = require("../../../core/clipboard");
jest.mock('child_process', () => ({
    spawn: jest.fn(() => ({
        stdin: { write: jest.fn(), end: jest.fn() },
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn((event, cb) => { if (event === 'close')
            cb(0); })
    }))
}));
describe('clipboard', () => {
    it('should copy to clipboard', async () => {
        await expect((0, clipboard_1.copyToClipboard)('hi')).resolves.toBeUndefined();
    });
    it('should read from clipboard', async () => {
        await expect((0, clipboard_1.readClipboard)()).resolves.toBe('');
    });
});
