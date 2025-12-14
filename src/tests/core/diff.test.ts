import { applyDiff, DiffPatch } from '../../../core/diff';
import fs from 'fs';

jest.mock('fs');

describe('applyDiff', () => {
  it('should handle create and modify', () => {
    const patches: DiffPatch[] = [
      { type: 'create', path: 'a.txt', content: 'x' },
      { type: 'modify', path: 'b.txt', content: 'y' }
    ];
    applyDiff('.', patches);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  });

  it('should handle delete', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const patches: DiffPatch[] = [{ type: 'delete', path: 'c.txt' }];
    applyDiff('.', patches);
    expect(fs.unlinkSync).toHaveBeenCalledWith('./c.txt');
  });
});