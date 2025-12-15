import { describe, test, expect } from 'bun:test';
import {
  getStringWidth,
  wrapText,
  padString,
  truncateString,
  getTerminalWidth,
} from '../src/utils/wrap.js';

describe('getStringWidth', () => {
  test('returns correct width for ASCII text', () => {
    expect(getStringWidth('hello')).toBe(5);
    expect(getStringWidth('')).toBe(0);
    expect(getStringWidth('test string')).toBe(11);
  });

  test('strips ANSI codes for width calculation', () => {
    // ANSI codes should not count toward width
    expect(getStringWidth('\x1b[31mred\x1b[0m')).toBe(3);
    expect(getStringWidth('\x1b[1mbold\x1b[22m')).toBe(4);
  });
});

describe('wrapText', () => {
  test('wraps long lines', () => {
    const text = 'This is a longer line that should be wrapped';
    const result = wrapText(text, 20);
    expect(result.length).toBeGreaterThan(1);
  });

  test('preserves short lines', () => {
    const text = 'Short';
    const result = wrapText(text, 20);
    expect(result).toEqual(['Short']);
  });

  test('handles empty string', () => {
    const result = wrapText('', 20);
    expect(result).toEqual(['']);
  });

  test('handles newlines in text', () => {
    const text = 'Line 1\nLine 2';
    const result = wrapText(text, 50);
    expect(result.length).toBe(2);
  });
});

describe('padString', () => {
  test('pads string to specified width', () => {
    expect(padString('test', 10)).toBe('test      ');
    expect(padString('test', 10).length).toBe(10);
  });

  test('does not truncate if string is longer', () => {
    expect(padString('longer', 4)).toBe('longer');
  });

  test('uses custom padding character', () => {
    expect(padString('x', 5, '-')).toBe('x----');
  });
});

describe('truncateString', () => {
  test('truncates long strings with ellipsis', () => {
    const result = truncateString('This is a very long string', 10);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result).toContain('…');
  });

  test('preserves short strings', () => {
    expect(truncateString('short', 10)).toBe('short');
  });
});

describe('getTerminalWidth', () => {
  test('returns a positive number', () => {
    const width = getTerminalWidth();
    expect(width).toBeGreaterThan(0);
  });

  test('returns default width if terminal width unavailable', () => {
    const width = getTerminalWidth();
    // Should be at least 40 (minimum reasonable terminal width)
    expect(width).toBeGreaterThanOrEqual(40);
  });
});
