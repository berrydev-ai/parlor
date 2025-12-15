import { describe, test, expect } from 'bun:test';
import { escapeSpecialTags, stripTags, extractTagContent } from '../src/utils/escape.js';

describe('escapeSpecialTags', () => {
  test('escapes think tags', () => {
    const result = escapeSpecialTags('<think>thinking content</think>');
    expect(result).toContain('[THINKING]');
    expect(result).not.toContain('<think>');
  });

  test('escapes tool tags', () => {
    const result = escapeSpecialTags('<tool>tool content</tool>');
    expect(result).toContain('[TOOL]');
    expect(result).not.toContain('<tool>');
  });

  test('escapes system tags', () => {
    const result = escapeSpecialTags('<system>system content</system>');
    expect(result).toContain('[SYSTEM]');
    expect(result).not.toContain('<system>');
  });

  test('handles text without special tags', () => {
    const text = 'Plain text without tags';
    expect(escapeSpecialTags(text)).toBe(text);
  });

  test('preserves non-special tags', () => {
    const text = '<other>content</other>';
    expect(escapeSpecialTags(text)).toBe(text);
  });
});

describe('stripTags', () => {
  test('removes all tags', () => {
    const result = stripTags('<tag>content</tag>');
    expect(result).toBe('content');
  });

  test('removes multiple tags', () => {
    const result = stripTags('<a>one</a> <b>two</b>');
    expect(result).toBe('one two');
  });

  test('handles text without tags', () => {
    const text = 'No tags here';
    expect(stripTags(text)).toBe(text);
  });

  test('removes nested tags', () => {
    const result = stripTags('<outer><inner>text</inner></outer>');
    expect(result).toBe('text');
  });
});

describe('extractTagContent', () => {
  test('extracts content from tag', () => {
    const result = extractTagContent('<tag>content</tag>', 'tag');
    expect(result).toBe('content');
  });

  test('returns null for non-existent tag', () => {
    const result = extractTagContent('<tag>content</tag>', 'other');
    expect(result).toBeNull();
  });

  test('extracts content from first matching tag', () => {
    const result = extractTagContent('<tag>first</tag><tag>second</tag>', 'tag');
    expect(result).toBe('first');
  });

  test('handles text without matching tag', () => {
    const result = extractTagContent('plain text', 'tag');
    expect(result).toBeNull();
  });
});
