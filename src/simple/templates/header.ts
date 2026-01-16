import { createColorizer } from '../utils/color.js';
import { getTerminalWidth, getStringWidth } from '../../utils/wrap.js';
import { DOUBLE, type BoxStyle } from '../../boxes/styles.js';

// Default max width to prevent excessively wide output
const DEFAULT_MAX_WIDTH = 120;

export interface HeaderOptions {
  width?: number;
  maxWidth?: number;
  color?: string;
  style?: BoxStyle;
  align?: 'left' | 'center' | 'right';
}

/**
 * Build a header divider with title
 * Example: ═══════════ TITLE ═══════════
 */
export function buildHeader(title: string, options: HeaderOptions = {}): string {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const width = Math.min(options.width ?? getTerminalWidth(), maxWidth);
  const style = options.style ?? DOUBLE;
  const align = options.align ?? 'center';
  const color = options.color ?? 'white';

  const colorize = createColorizer(color);

  const titleWidth = getStringWidth(title);
  const padding = 2; // space around title
  const availableWidth = width - titleWidth - padding * 2;

  if (availableWidth < 4) {
    // Not enough space, just show title
    return colorize(title);
  }

  const char = style.horizontal;

  let leftWidth: number;
  let rightWidth: number;

  switch (align) {
    case 'left':
      leftWidth = 3;
      rightWidth = availableWidth - leftWidth;
      break;
    case 'right':
      rightWidth = 3;
      leftWidth = availableWidth - rightWidth;
      break;
    case 'center':
    default:
      leftWidth = Math.floor(availableWidth / 2);
      rightWidth = availableWidth - leftWidth;
      break;
  }

  const leftBar = char.repeat(Math.max(0, leftWidth));
  const rightBar = char.repeat(Math.max(0, rightWidth));

  return colorize(`${leftBar} ${title} ${rightBar}`);
}
