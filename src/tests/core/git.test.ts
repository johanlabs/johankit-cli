import { ensureGitCommit } from '../../../core/git';
import { execSync } from 'child_process';

jest.mock('child_process');

describe('ensureGitCommit', () => {
  it('should call git commands without crashing', () => {
    (execSync as jest.Mock).mockImplementation(() => '');
    expect(() => ensureGitCommit()).not.toThrow();
  });
});