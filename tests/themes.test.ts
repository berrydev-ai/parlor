import { describe, test, expect } from 'bun:test';
import { defaultTheme, agnoTheme, darkTheme, lightTheme, getTheme } from '../src/themes/default.js';
import type { Theme } from '../src/themes/types.js';

describe('defaultTheme', () => {
  test('has all required color properties', () => {
    const requiredKeys: (keyof Theme)[] = [
      'message',
      'response',
      'reasoning',
      'toolCalls',
      'citations',
      'error',
      'team',
      'warning',
      'info',
      'success',
    ];

    for (const key of requiredKeys) {
      expect(defaultTheme).toHaveProperty(key);
      expect(typeof defaultTheme[key]).toBe('string');
    }
  });

  test('uses cyan for message', () => {
    expect(defaultTheme.message).toBe('cyan');
  });

  test('uses blue for response', () => {
    expect(defaultTheme.response).toBe('blue');
  });

  test('uses red for error', () => {
    expect(defaultTheme.error).toBe('red');
  });
});

describe('agnoTheme', () => {
  test('matches defaultTheme structure', () => {
    expect(Object.keys(agnoTheme)).toEqual(Object.keys(defaultTheme));
  });
});

describe('darkTheme', () => {
  test('has all required properties', () => {
    expect(darkTheme).toHaveProperty('message');
    expect(darkTheme).toHaveProperty('response');
    expect(darkTheme).toHaveProperty('error');
  });
});

describe('lightTheme', () => {
  test('has all required properties', () => {
    expect(lightTheme).toHaveProperty('message');
    expect(lightTheme).toHaveProperty('response');
    expect(lightTheme).toHaveProperty('error');
  });
});

describe('getTheme', () => {
  test('returns correct theme by name', () => {
    expect(getTheme('default')).toBe(defaultTheme);
    expect(getTheme('agno')).toBe(agnoTheme);
    expect(getTheme('dark')).toBe(darkTheme);
    expect(getTheme('light')).toBe(lightTheme);
  });

  test('defaults to defaultTheme for unknown name', () => {
    expect(getTheme('unknown' as unknown as Parameters<typeof getTheme>[0])).toBe(defaultTheme);
  });
});
