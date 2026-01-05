import { validatePatches } from '../core/schema';

describe('validatePatches', () => {
  it('should validate correct file patches', () => {
    const input = [{ path: 'src/index.ts', content: 'test' }];
    const output = validatePatches(input);
    expect(output).toEqual(input);
  });

  it('should validate correct console patches', () => {
    const input = [{ type: 'console', command: 'npm install' }];
    const output = validatePatches(input);
    expect(output).toEqual(input);
  });

  it('should throw error for invalid items', () => {
    const input = [{ invalid: 'item' }];
    expect(() => validatePatches(input)).toThrow();
  });

  it('should throw error if input is not an array', () => {
    expect(() => validatePatches({})).toThrow();
  });
});