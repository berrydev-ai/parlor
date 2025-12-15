import wrapAnsi from 'wrap-ansi';
import stringWidth from 'string-width';

// Declare Deno global for cross-runtime support
declare const Deno: { consoleSize(): { columns: number; rows: number } } | undefined;

/**
 * Get terminal width, with fallback
 */
export function getTerminalWidth(): number {
  if (typeof process !== 'undefined' && process.stdout && process.stdout.columns) {
    return process.stdout.columns;
  }

  // Deno support
  if (typeof Deno !== 'undefined') {
    try {
      const size = Deno.consoleSize();
      return size.columns;
    } catch {
      return 80;
    }
  }

  return 80; // Fallback
}

/**
 * Wrap text to a specific width, handling ANSI codes
 */
export function wrapText(text: string, width: number, options?: { hard?: boolean }): string[] {
  const wrapped = wrapAnsi(text, width, {
    hard: options?.hard ?? true,
    trim: false,
  });
  return wrapped.split('\n');
}

/**
 * Get the visible width of a string (ignoring ANSI codes)
 */
export function getStringWidth(str: string): number {
  return stringWidth(str);
}

/**
 * Pad a string to a specific width
 */
export function padString(str: string, width: number, char: string = ' '): string {
  const currentWidth = getStringWidth(str);
  if (currentWidth >= width) return str;
  return str + char.repeat(width - currentWidth);
}

/**
 * Truncate a string to a specific width
 */
export function truncateString(str: string, width: number, ellipsis: string = '…'): string {
  const currentWidth = getStringWidth(str);
  if (currentWidth <= width) return str;

  // Simple truncation - this could be improved with proper ANSI handling
  return str.slice(0, width - ellipsis.length) + ellipsis;
}
