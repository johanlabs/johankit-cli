import { scanDir } from '../core/scan';
import fs from 'fs';
import path from 'path';

describe('scanDir', () => {
  const testDir = path.join(__dirname, 'test-tmp');

  beforeEach(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
    fs.mkdirSync(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
  });

  it('should scan files in a directory', () => {
    fs.writeFileSync(path.join(testDir, 'test.ts'), 'console.log("hello")');
    const results = scanDir(testDir);
    expect(results.length).toBe(1);
    expect(results[0].path).toBe('test.ts');
    expect(results[0].content).toBe('console.log("hello")');
  });

  it('should respect ignore patterns from config', () => {
    fs.mkdirSync(path.join(testDir, 'node_modules'));
    fs.writeFileSync(path.join(testDir, 'node_modules/ignore.ts'), 'ignore');
    fs.writeFileSync(path.join(testDir, 'keep.ts'), 'keep');
    const results = scanDir(testDir);
    expect(results.find(r => r.path.includes('node_modules'))).toBeUndefined();
    expect(results.find(r => r.path === 'keep.ts')).toBeDefined();
  });
});