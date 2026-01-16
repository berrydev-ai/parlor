/**
 * ANSI escape code utilities for terminal control
 */

const ESC = '\x1b[';

/**
 * Cursor control functions
 */
export const cursor = {
  /** Hide the cursor */
  hide: (): void => {
    process.stdout.write(`${ESC}?25l`);
  },

  /** Show the cursor */
  show: (): void => {
    process.stdout.write(`${ESC}?25h`);
  },

  /** Save cursor position */
  save: (): void => {
    process.stdout.write(`${ESC}s`);
  },

  /** Restore cursor position */
  restore: (): void => {
    process.stdout.write(`${ESC}u`);
  },

  /** Move cursor up n lines */
  up: (n: number): void => {
    if (n > 0) {
      process.stdout.write(`${ESC}${n}A`);
    }
  },

  /** Move cursor down n lines */
  down: (n: number): void => {
    if (n > 0) {
      process.stdout.write(`${ESC}${n}B`);
    }
  },

  /** Move cursor to column n (1-based) */
  toColumn: (n: number): void => {
    process.stdout.write(`${ESC}${n}G`);
  },

  /** Move cursor to start of line */
  toStart: (): void => {
    process.stdout.write('\r');
  },
};

/**
 * Line control functions
 */
export const line = {
  /** Clear entire line */
  clear: (): void => {
    process.stdout.write(`${ESC}2K`);
  },

  /** Clear from cursor to end of line */
  clearToEnd: (): void => {
    process.stdout.write(`${ESC}K`);
  },

  /** Clear from start of line to cursor */
  clearToStart: (): void => {
    process.stdout.write(`${ESC}1K`);
  },

  /**
   * Erase n lines (moves up and clears each line)
   * Cursor ends at column 0 of where the first erased line was
   */
  eraseLines: (n: number): void => {
    if (n <= 0) return;

    let output = '';
    for (let i = 0; i < n; i++) {
      // Move up, clear line
      output += `${ESC}1A${ESC}2K`;
    }
    // Ensure cursor is at column 0
    output += '\r';
    process.stdout.write(output);
  },
};

/**
 * Generate RGB foreground color escape code (24-bit truecolor)
 */
export function rgb(r: number, g: number, b: number): string {
  return `${ESC}38;2;${r};${g};${b}m`;
}

/**
 * Generate RGB background color escape code (24-bit truecolor)
 */
export function bgRgb(r: number, g: number, b: number): string {
  return `${ESC}48;2;${r};${g};${b}m`;
}

/** Reset foreground color to default */
export const resetFg = `${ESC}39m`;

/** Reset background color to default */
export const resetBg = `${ESC}49m`;

/** Reset all attributes */
export const reset = `${ESC}0m`;

/**
 * Color interpolation for gradients
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Linear interpolation between two colors
 */
export function lerpColor(from: RGB, to: RGB, t: number): RGB {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return {
    r: clamp(from.r + (to.r - from.r) * t),
    g: clamp(from.g + (to.g - from.g) * t),
    b: clamp(from.b + (to.b - from.b) * t),
  };
}

/**
 * Named colors as RGB values
 */
export const colors: Record<string, RGB> = {
  black: { r: 0, g: 0, b: 0 },
  red: { r: 205, g: 49, b: 49 },
  green: { r: 13, g: 188, b: 121 },
  yellow: { r: 229, g: 229, b: 16 },
  blue: { r: 36, g: 114, b: 200 },
  magenta: { r: 188, g: 63, b: 188 },
  cyan: { r: 17, g: 168, b: 205 },
  white: { r: 229, g: 229, b: 229 },
  gray: { r: 102, g: 102, b: 102 },
  grey: { r: 102, g: 102, b: 102 },
};

/**
 * Get RGB for a named color, falling back to white
 */
export function getColorRgb(name: string): RGB {
  return colors[name.toLowerCase()] ?? colors.white;
}
