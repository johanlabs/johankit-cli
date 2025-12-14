import { validatePatches } from '../../../core/validation';

describe('validation', () => {
  it('validates correct array', () => {
    const input = [{ type: 'create', path: 'a.txt', content: 'x' }];
    expect(validatePatches(input)).toEqual(input);
  });

  it('throws on missing content', () => {
    const input = [{ type: 'create', path: 'a.txt' }];
    expect(() => validatePatches(input)).toThrow();
  });
});