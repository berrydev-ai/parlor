import { describe, test, expect } from 'bun:test';
import {
  HEAVY,
  SINGLE,
  DOUBLE,
  ROUNDED,
  BOLD,
  getBoxStyle,
  BOX_STYLES,
} from '../src/boxes/styles.js';

describe('Box Styles', () => {
  test('HEAVY style has all required characters', () => {
    expect(HEAVY.topLeft).toBe('┏');
    expect(HEAVY.topRight).toBe('┓');
    expect(HEAVY.bottomLeft).toBe('┗');
    expect(HEAVY.bottomRight).toBe('┛');
    expect(HEAVY.horizontal).toBe('━');
    expect(HEAVY.vertical).toBe('┃');
  });

  test('SINGLE style has all required characters', () => {
    expect(SINGLE.topLeft).toBe('┌');
    expect(SINGLE.topRight).toBe('┐');
    expect(SINGLE.bottomLeft).toBe('└');
    expect(SINGLE.bottomRight).toBe('┘');
    expect(SINGLE.horizontal).toBe('─');
    expect(SINGLE.vertical).toBe('│');
  });

  test('DOUBLE style has all required characters', () => {
    expect(DOUBLE.topLeft).toBe('╔');
    expect(DOUBLE.topRight).toBe('╗');
    expect(DOUBLE.bottomLeft).toBe('╚');
    expect(DOUBLE.bottomRight).toBe('╝');
    expect(DOUBLE.horizontal).toBe('═');
    expect(DOUBLE.vertical).toBe('║');
  });

  test('ROUNDED style has all required characters', () => {
    expect(ROUNDED.topLeft).toBe('╭');
    expect(ROUNDED.topRight).toBe('╮');
    expect(ROUNDED.bottomLeft).toBe('╰');
    expect(ROUNDED.bottomRight).toBe('╯');
    expect(ROUNDED.horizontal).toBe('─');
    expect(ROUNDED.vertical).toBe('│');
  });
});

describe('getBoxStyle', () => {
  test('returns correct style by name', () => {
    expect(getBoxStyle('heavy')).toBe(HEAVY);
    expect(getBoxStyle('single')).toBe(SINGLE);
    expect(getBoxStyle('double')).toBe(DOUBLE);
    expect(getBoxStyle('rounded')).toBe(ROUNDED);
    expect(getBoxStyle('bold')).toBe(BOLD);
  });

  test('defaults to HEAVY for unknown style', () => {
    expect(getBoxStyle('unknown' as unknown as Parameters<typeof getBoxStyle>[0])).toBe(HEAVY);
  });
});

describe('BOX_STYLES', () => {
  test('contains all style names', () => {
    expect(BOX_STYLES).toHaveProperty('heavy');
    expect(BOX_STYLES).toHaveProperty('single');
    expect(BOX_STYLES).toHaveProperty('double');
    expect(BOX_STYLES).toHaveProperty('rounded');
    expect(BOX_STYLES).toHaveProperty('bold');
  });
});
