"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("../../../core/git");
const child_process_1 = require("child_process");
jest.mock('child_process');
describe('ensureGitCommit', () => {
    it('should call git commands without crashing', () => {
        child_process_1.execSync.mockImplementation(() => '');
        expect(() => (0, git_1.ensureGitCommit)()).not.toThrow();
    });
});
