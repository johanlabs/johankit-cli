import { sync } from '../../../cli/commands/sync';
import * as scan from '../../../core/scan';
import * as clipboard from '../../../core/clipboard';
import * as diff from '../../../core/diff';
import * as validation from '../../../core/validation';

jest.mock('../../../core/scan');
jest.mock('../../../core/clipboard');
jest.mock('../../../core/diff');
jest.mock('../../../core/validation');

describe('sync', () => {
  it('should apply patches and update clipboard', async () => {
    (scan.scanDir as jest.Mock).mockReturnValue([]);
    (clipboard.copyToClipboard as jest.Mock).mockResolvedValue(undefined);
    (validation.validatePatches as jest.Mock).mockImplementation(p => p);

    const input = JSON.stringify([{ type: 'create', path: 'a.txt', content: 'x' }]);
    process.stdin.push(input);
    process.stdin.push(null);

    await sync('.');
    expect(diff.applyDiff).toHaveBeenCalled();
    expect(clipboard.copyToClipboard).toHaveBeenCalledTimes(2);
  });
});