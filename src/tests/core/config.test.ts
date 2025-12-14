import { loadConfig } from '../../../core/config';
import fs from 'fs';
import { load as yamlLoad } from 'js-yaml';

jest.mock('fs');
jest.mock('js-yaml');

describe('loadConfig', () => {
  it('should return defaults if file missing', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => { throw { code: 'ENOENT' }; });
    const config = loadConfig('.');
    expect(config.ignore).toContain('.git');
  });

  it('should merge user ignore', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('ignore:\n  - test');
    (yamlLoad as jest.Mock).mockReturnValue({ ignore: ['test'] });
    const config = loadConfig('.');
    expect(config.ignore).toContain('test');
  });
});