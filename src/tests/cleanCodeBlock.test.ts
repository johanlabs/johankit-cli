import cleanCodeBlock from '../utils/cleanCodeBlock';

describe('cleanCodeBlock', () => {
  it('should extract JSON from markdown blocks', () => {
    const input = 'Check this: ```json [{"path": "test"}] ``` and some text';
    const { cleaned } = cleanCodeBlock(input);
    expect(cleaned).toBe('[{"path": "test"}]');
  });

  it('should handle raw JSON arrays', () => {
    const input = '[{"path": "test"}]';
    const { cleaned } = cleanCodeBlock(input);
    expect(cleaned).toBe('[{"path": "test"}]');
  });

  it('should remove invisible characters', () => {
    const input = '\uFEFF[{"path": "test"}]';
    const { cleaned } = cleanCodeBlock(input);
    expect(cleaned).toBe('[{"path": "test"}]');
  });
});