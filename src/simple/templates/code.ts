import { renderCodeBlock } from '../../utils/markdown.js';
import { getTerminalWidth } from '../../utils/wrap.js';

// Default max width to prevent excessively wide output
const DEFAULT_MAX_WIDTH = 120;

export interface CodeOptions {
  language?: string;
  width?: number;
  maxWidth?: number;
}

/**
 * Build a syntax-highlighted code block
 */
export function buildCode(code: string, options: CodeOptions = {}): string {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const width = Math.min(options.width ?? getTerminalWidth(), maxWidth);
  const language = options.language;

  return renderCodeBlock(code, language, width);
}
