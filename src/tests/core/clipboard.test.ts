import { copyToClipboard, readClipboard } from '../../../core/clipboard';
import { spawn } from 'child_process';

jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    stdin: { write: jest.fn(), end: jest.fn() },
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
    on: jest.fn((event, cb) => { if (event === 'close') cb(0); })
  }))
}));

describe('clipboard', () => {
  it('should copy to clipboard', async () => {
    await expect(copyToClipboard('hi')).resolves.toBeUndefined();
  });

  it('should read from clipboard', async () => {
    await expect(readClipboard()).resolves.toBe('');
  });
});