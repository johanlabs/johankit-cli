import { validatePatches } from '../../../core/schema';

describe('validatePatches', () => {
  it('should validate correct patches', () => {
    const patches = [{ type: 'create', path: 'a.txt', content: 'x' }];
    expect(validatePatches(patches)).toEqual(patches);
  });

  it('should throw on invalid patches', () => {
    const patches = [{ type: 'invalid', path: 'a.txt', content: 'x' }];
    expect(() => validatePatches(patches)).toThrow();
  });
});