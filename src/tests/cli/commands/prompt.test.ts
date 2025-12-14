import { prompt } from '../../../cli/commands/prompt';
import * as scan from '../../../core/scan';
import * as clipboard from '../../../core/clipboard';

jest.mock('../../../core/scan');
jest.mock('../../../core/clipboard');

describe('prompt', () => {
  it('should generate prompt with snapshot and copy to clipboard', async () => {
    (scan.scanDir as jest.Mock).mockReturnValue([{ path: 'file.js', content: 'console.log(1)' }]);
    await prompt('.', 'do something');
    expect(clipboard.copyToClipboard).toHaveBeenCalled();
  });
});