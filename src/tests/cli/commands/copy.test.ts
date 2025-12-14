import { copy } from '../../../cli/commands/copy';
import * as scan from '../../../core/scan';
import * as clipboard from '../../../core/clipboard';

jest.mock('../../../core/scan');
jest.mock('../../../core/clipboard');

describe('copy', () => {
  it('should copy single file snapshot to clipboard', () => {
    (scan.scanDir as jest.Mock).mockReturnValue([{ path: 'file.txt', content: 'hello' }]);
    copy('file.txt');
    expect(clipboard.copyToClipboard).toHaveBeenCalledWith(JSON.stringify([{ path: 'file.txt', content: 'hello' }], null, 2));
  });

  it('should copy multiple file snapshots to clipboard', () => {
    (scan.scanDir as jest.Mock)
      .mockReturnValueOnce([{ path: 'file1.txt', content: 'a' }])
      .mockReturnValueOnce([{ path: 'file2.txt', content: 'b' }]);

    copy(['file1.txt', 'file2.txt']);
    expect(clipboard.copyToClipboard).toHaveBeenCalledWith(JSON.stringify([
      { path: 'file1.txt', content: 'a' },
      { path: 'file2.txt', content: 'b' }
    ], null, 2));
  });
});