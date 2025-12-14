"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../core/config");
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = require("js-yaml");
jest.mock('fs');
jest.mock('js-yaml');
describe('loadConfig', () => {
    it('should return defaults if file missing', () => {
        fs_1.default.readFileSync.mockImplementation(() => { throw { code: 'ENOENT' }; });
        const config = (0, config_1.loadConfig)('.');
        expect(config.ignore).toContain('.git');
    });
    it('should merge user ignore', () => {
        fs_1.default.readFileSync.mockReturnValue('ignore:\n  - test');
        js_yaml_1.load.mockReturnValue({ ignore: ['test'] });
        const config = (0, config_1.loadConfig)('.');
        expect(config.ignore).toContain('test');
    });
});
