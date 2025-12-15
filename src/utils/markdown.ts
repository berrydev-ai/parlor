import { Chalk } from 'chalk';
import { highlight } from 'cli-highlight';
import stripAnsi from 'strip-ansi';

// Force truecolor support to ensure colors output in all environments
const chalk = new Chalk({ level: 3 });

// Dark background color (similar to VS Code dark theme #2D2D2D)
const darkBg = chalk.bgRgb(45, 45, 45);

/**
 * Render a code block with syntax highlighting and dark background
 * @param code - The code content
 * @param language - Optional language for syntax highlighting
 * @param width - Optional width to pad lines to (for full-width background)
 */
export function renderCodeBlock(code: string, language?: string, width?: number): string {
  const lines: string[] = [];

  // Highlight the code with syntax colors
  let highlightedCode: string;
  try {
    highlightedCode = highlight(code, { language: language || 'plaintext', ignoreIllegals: true });
  } catch {
    // If highlighting fails, use plain code
    highlightedCode = code;
  }

  // Split into lines
  const codeLines = highlightedCode.split('\n');

  // Add language label if present (with dark background, full width)
  if (language) {
    const labelContent = `  ${language}`;
    const labelPadding = width ? ' '.repeat(Math.max(0, width - labelContent.length)) : '';
    lines.push(darkBg(chalk.dim(labelContent + labelPadding)));
  }

  // Add each code line with full-width background
  for (const line of codeLines) {
    const lineContent = `  ${line}`;
    // Strip ANSI codes to get actual visible length for padding calculation
    const visibleLength = stripAnsi(lineContent).length;
    const rightPadding = width ? ' '.repeat(Math.max(0, width - visibleLength)) : '  ';
    lines.push(darkBg(lineContent + rightPadding));
  }

  return lines.join('\n');
}

/**
 * Render inline code with dark background
 */
export function renderInlineCode(code: string): string {
  return darkBg(` ${code} `);
}

/**
 * Render bold text
 */
export function renderBold(text: string): string {
  return chalk.bold(text);
}

/**
 * Render italic text
 */
export function renderItalic(text: string): string {
  return chalk.italic(text);
}

/**
 * Process markdown text and render with proper formatting
 * This function handles code blocks, bold, italic, and inline code
 * @param text - The markdown text to render
 * @param width - Optional width for full-width code block backgrounds
 */
export function renderMarkdown(text: string, width?: number): string {
  let result = text;

  // Process code blocks first (```...```)
  result = result.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    return '\n' + renderCodeBlock(code.trim(), lang || undefined, width) + '\n';
  });

  // Process inline code (`...`)
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    return renderInlineCode(code);
  });

  // Process bold (**...**)
  result = result.replace(/\*\*([^*]+)\*\*/g, (_, text) => {
    return renderBold(text);
  });

  // Process italic (*...*)
  result = result.replace(/\*([^*]+)\*/g, (_, text) => {
    return renderItalic(text);
  });

  return result;
}

/**
 * Check if text contains markdown syntax that should be rendered
 */
export function containsMarkdown(text: string): boolean {
  // Check for common markdown patterns
  const patterns = [
    /```[\s\S]*?```/, // Code blocks
    /`[^`]+`/, // Inline code
    /\*\*[^*]+\*\*/, // Bold
    /\*[^*]+\*/, // Italic
    /__[^_]+__/, // Bold alt
    /_[^_]+_/, // Italic alt
  ];

  return patterns.some((pattern) => pattern.test(text));
}
