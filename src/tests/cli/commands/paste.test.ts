import { paste } from '../../../cli/commands/paste';
import * as clipboard from '../../../core/clipboard';
import * as write from '../../../core/write';

jest.mock('../../../core/clipboard');
jest.mock('../../../core/write');

describe('paste', () => {
  it('should write files from clipboard JSON', async () => {
    (clipboard.readClipboard as jest.Mock).mockResolvedValue(JSON.stringify([{ path: 'a.txt', content: 'hi' }]));
    await paste('dir');
    expect(write.writeFiles).toHaveBeenCalledWith('dir', [{ path: 'a.txt', content: 'hi' }], true);
  });

  it('should throw on invalid JSON', async () => {
    (clipboard.readClipboard as jest.Mock).mockResolvedValue('not json');
    await expect(paste('dir')).rejects.toThrow('Clipboard content is not valid JSON');
  });
});