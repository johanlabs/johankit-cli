"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../../../core/validation");
describe('validation', () => {
    it('validates correct array', () => {
        const input = [{ type: 'create', path: 'a.txt', content: 'x' }];
        expect((0, validation_1.validatePatches)(input)).toEqual(input);
    });
    it('throws on missing content', () => {
        const input = [{ type: 'create', path: 'a.txt' }];
        expect(() => (0, validation_1.validatePatches)(input)).toThrow();
    });
});
