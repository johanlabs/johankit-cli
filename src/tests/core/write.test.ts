import { writeFiles } from '../../../core/write';
import fs from 'fs';
import * as git from '../../../core/git';

jest.mock('fs');
jest.mock('../../../core/git');

describe('writeFiles', () => {
  it('should write files and commit', () => {
    const files = [{ path: 'a.txt', content: 'x' }];
    writeFiles('.', files, true);
    expect(fs.writeFileSync).toHaveBeenCalledWith('./a.txt', 'x', 'utf8');
    expect(git.ensureGitCommit).toHaveBeenCalled();
  });
});