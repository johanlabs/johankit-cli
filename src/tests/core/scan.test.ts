import { scanDir } from '../../../core/scan';
import fs from 'fs';

jest.mock('fs');

describe('scanDir', () => {
  it('should scan files with default ignores', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue([{ name: 'a.txt', isDirectory: () => false }]);
    (fs.readFileSync as jest.Mock).mockReturnValue('content');
    const files = scanDir('.');
    expect(files[0].path).toBe('a.txt');
  });
});