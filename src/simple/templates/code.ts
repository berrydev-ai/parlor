import { renderCodeBlock } from '../../utils/markdown.js';
import { getTerminalWidth } from '../../utils/wrap.js';

export interface CodeOptions {
  language?: string;
  width?: number;
}

/**
 * Build a syntax-highlighted code block
 */
export function buildCode(code: string, options: CodeOptions = {}): string {
  const width = options.width ?? getTerminalWidth();
  const language = options.language;

  return renderCodeBlock(code, language, width);
}
