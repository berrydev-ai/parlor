import { createColorizer } from '../utils/color.js';
import { wrapText, getTerminalWidth } from '../../utils/wrap.js';

// Default max width to prevent excessively wide output
const DEFAULT_MAX_WIDTH = 120;

export interface ListOptions {
  width?: number;
  maxWidth?: number;
  color?: string;
  bullet?: string;
  numbered?: boolean;
  indent?: number;
}

/**
 * Build a bullet or numbered list
 * Example:
 *   • Item one
 *   • Item two
 * or:
 *   1. Item one
 *   2. Item two
 */
export function buildList(items: string[], options: ListOptions = {}): string {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const width = Math.min(options.width ?? getTerminalWidth(), maxWidth);
  const color = options.color ?? 'white';
  const bullet = options.bullet ?? '•';
  const numbered = options.numbered ?? false;
  const indent = options.indent ?? 2;

  const colorize = createColorizer(color);

  const lines: string[] = [];
  const indentStr = ' '.repeat(indent);

  items.forEach((item, index) => {
    const prefix = numbered ? `${index + 1}. ` : `${bullet} `;
    const prefixWidth = prefix.length;
    const contentWidth = width - indent - prefixWidth;

    // Wrap long items
    const wrappedLines = wrapText(item, contentWidth);

    wrappedLines.forEach((line, lineIndex) => {
      if (lineIndex === 0) {
        lines.push(colorize(indentStr + prefix + line));
      } else {
        // Continuation lines are indented to align with first line content
        lines.push(colorize(indentStr + ' '.repeat(prefixWidth) + line));
      }
    });
  });

  return lines.join('\n');
}
