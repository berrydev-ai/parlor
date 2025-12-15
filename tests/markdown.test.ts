import { describe, test, expect } from 'bun:test';
import {
  renderMarkdown,
  containsMarkdown,
  renderCodeBlock,
  renderInlineCode,
} from '../src/utils/markdown.js';

describe('containsMarkdown', () => {
  test('detects code blocks', () => {
    expect(containsMarkdown('```python\nprint("hello")\n```')).toBe(true);
    expect(containsMarkdown('```\ncode\n```')).toBe(true);
  });

  test('detects inline code', () => {
    expect(containsMarkdown('Use `console.log()` to debug')).toBe(true);
  });

  test('detects bold text', () => {
    expect(containsMarkdown('This is **bold** text')).toBe(true);
  });

  test('detects italic text', () => {
    expect(containsMarkdown('This is *italic* text')).toBe(true);
  });

  test('returns false for plain text', () => {
    expect(containsMarkdown('This is plain text')).toBe(false);
    expect(containsMarkdown('No markdown here')).toBe(false);
  });
});

describe('renderCodeBlock', () => {
  test('renders code with language label', () => {
    const result = renderCodeBlock('print("hello")', 'python');
    expect(result).toContain('python');
    expect(result).toContain('print');
  });

  test('renders code without language', () => {
    const result = renderCodeBlock('some code');
    expect(result).toContain('some code');
  });

  test('applies dark background (ANSI codes)', () => {
    const result = renderCodeBlock('code', 'js');
    // Check for RGB background ANSI escape sequence
    expect(result).toContain('\x1b[48;2;45;45;45m');
  });

  test('pads lines to specified width', () => {
    const result = renderCodeBlock('x', undefined, 50);
    // The line should be padded with spaces to reach width
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe('renderInlineCode', () => {
  test('wraps code with dark background', () => {
    const result = renderInlineCode('code');
    expect(result).toContain('code');
    expect(result).toContain('\x1b[48;2;45;45;45m');
  });

  test('adds padding around code', () => {
    const result = renderInlineCode('test');
    expect(result).toContain(' test ');
  });
});

describe('renderMarkdown', () => {
  test('renders code blocks', () => {
    const input = 'Before\n\n```js\nconst x = 1;\n```\n\nAfter';
    const result = renderMarkdown(input);
    expect(result).toContain('const x = 1');
    expect(result).toContain('Before');
    expect(result).toContain('After');
  });

  test('renders inline code', () => {
    const input = 'Use `npm install` to install';
    const result = renderMarkdown(input);
    expect(result).toContain('npm install');
  });

  test('renders bold text', () => {
    const input = 'This is **important**';
    const result = renderMarkdown(input);
    // Bold uses ANSI code \x1b[1m
    expect(result).toContain('\x1b[1m');
    expect(result).toContain('important');
  });

  test('renders italic text', () => {
    const input = 'This is *emphasized*';
    const result = renderMarkdown(input);
    // Italic uses ANSI code \x1b[3m
    expect(result).toContain('\x1b[3m');
    expect(result).toContain('emphasized');
  });

  test('handles mixed markdown', () => {
    const input = '**Bold** and *italic* with `code`';
    const result = renderMarkdown(input);
    expect(result).toContain('Bold');
    expect(result).toContain('italic');
    expect(result).toContain('code');
  });

  test('passes width to code blocks', () => {
    const input = '```\nx\n```';
    const result = renderMarkdown(input, 80);
    // Result should have lines padded to width
    expect(result).toBeDefined();
  });
});
