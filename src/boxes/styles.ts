/**
 * Box drawing character sets for different border styles
 */

export interface BoxStyle {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
}

/**
 * Heavy border style - matches Agno's output
 * Uses Unicode Box Drawing Heavy characters
 */
export const HEAVY: BoxStyle = {
  topLeft: '┏',
  topRight: '┓',
  bottomLeft: '┗',
  bottomRight: '┛',
  horizontal: '━',
  vertical: '┃',
};

/**
 * Single border style
 */
export const SINGLE: BoxStyle = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
};

/**
 * Double border style
 */
export const DOUBLE: BoxStyle = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
};

/**
 * Rounded border style
 */
export const ROUNDED: BoxStyle = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
};

/**
 * Bold border style
 */
export const BOLD: BoxStyle = {
  topLeft: '┏',
  topRight: '┓',
  bottomLeft: '┗',
  bottomRight: '┛',
  horizontal: '━',
  vertical: '┃',
};

/**
 * Map of border style names to BoxStyle objects
 */
export const BOX_STYLES: Record<string, BoxStyle> = {
  heavy: HEAVY,
  single: SINGLE,
  double: DOUBLE,
  rounded: ROUNDED,
  bold: BOLD,
};

/**
 * Get a box style by name, defaults to HEAVY
 */
export function getBoxStyle(style?: string): BoxStyle {
  if (!style) return HEAVY;
  return BOX_STYLES[style.toLowerCase()] || HEAVY;
}
