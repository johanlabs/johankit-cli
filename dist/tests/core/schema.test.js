"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../core/schema");
describe('validatePatches', () => {
    it('should validate correct patches', () => {
        const patches = [{ type: 'create', path: 'a.txt', content: 'x' }];
        expect((0, schema_1.validatePatches)(patches)).toEqual(patches);
    });
    it('should throw on invalid patches', () => {
        const patches = [{ type: 'invalid', path: 'a.txt', content: 'x' }];
        expect(() => (0, schema_1.validatePatches)(patches)).toThrow();
    });
});
