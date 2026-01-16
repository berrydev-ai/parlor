import { createColorizer } from '../utils/color.js';
import { getTerminalWidth, getStringWidth, padString } from '../../utils/wrap.js';

// Default max width to prevent excessively wide output
const DEFAULT_MAX_WIDTH = 120;

export interface DescriptionListOptions {
  width?: number;
  maxWidth?: number;
  keyColor?: string;
  valueColor?: string;
  separator?: string;
  keyWidth?: number;
}

/**
 * Build a description list (key-value pairs)
 * Example:
 *   Name      Parlor
 *   Version   1.0
 */
export function buildDescriptionList(
  data: Record<string, string | number | boolean>,
  options: DescriptionListOptions = {}
): string {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const width = Math.min(options.width ?? getTerminalWidth(), maxWidth);
  const keyColor = options.keyColor ?? 'cyan';
  const valueColor = options.valueColor ?? 'white';
  const separator = options.separator ?? '  ';

  const colorizeKey = createColorizer(keyColor);
  const colorizeValue = createColorizer(valueColor);

  const entries = Object.entries(data);
  if (entries.length === 0) return '';

  // Calculate max key width
  const maxKeyWidth = options.keyWidth ?? Math.max(...entries.map(([key]) => getStringWidth(key)));

  const lines: string[] = [];

  for (const [key, value] of entries) {
    const paddedKey = padString(key, maxKeyWidth);
    const valueStr = String(value);

    // Check if line fits in width
    const lineWidth = maxKeyWidth + separator.length + getStringWidth(valueStr);
    if (lineWidth > width) {
      // Truncate value if needed
      const availableValueWidth = width - maxKeyWidth - separator.length;
      const truncatedValue =
        availableValueWidth > 3 ? valueStr.slice(0, availableValueWidth - 1) + '…' : valueStr;
      lines.push(colorizeKey(paddedKey) + separator + colorizeValue(truncatedValue));
    } else {
      lines.push(colorizeKey(paddedKey) + separator + colorizeValue(valueStr));
    }
  }

  return lines.join('\n');
}
