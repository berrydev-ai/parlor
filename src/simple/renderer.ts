import { createColorizer } from './utils/color.js';
import {
  getTerminalWidth,
  getStringWidth,
  wrapText,
} from '../utils/wrap.js';
import { renderMarkdown, containsMarkdown } from '../utils/markdown.js';
import { getBoxStyle, type BoxStyle } from '../boxes/styles.js';
import { defaultTheme, type Theme } from '../themes/default.js';

export interface PanelOptions {
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  borderColor?: string;
  width?: number;
  maxWidth?: number;
  padding?: number;
  markdown?: boolean;
}

/**
 * Build a bordered panel as a string
 */
export function buildPanel(content: string, options: PanelOptions = {}): string {
  const termWidth = getTerminalWidth();
  const maxWidth = options.maxWidth ?? termWidth;
  const width = Math.min(options.width ?? termWidth, maxWidth);
  const padding = options.padding ?? 1;
  const box = getBoxStyle(options.borderStyle ?? 'heavy');
  const borderColor = options.borderColor ?? 'white';

  const colorize = createColorizer(borderColor);

  // Calculate content width (inside the borders)
  const horizontalPadding = padding;
  const borderWidth = 2; // left + right border
  const contentWidth = width - borderWidth - horizontalPadding * 2;

  if (contentWidth < 1) {
    return content; // Not enough space for a panel
  }

  // Process content
  let processedContent = content;
  const shouldRenderMarkdown = options.markdown ?? containsMarkdown(content);
  if (shouldRenderMarkdown) {
    processedContent = renderMarkdown(content, contentWidth);
  }

  // Wrap content to fit
  const contentLines = wrapText(processedContent, contentWidth);

  // Build the panel
  const lines: string[] = [];
  const paddingStr = ' '.repeat(horizontalPadding);
  const emptyLine = colorize(box.vertical) + ' '.repeat(width - borderWidth) + colorize(box.vertical);

  // Top border
  lines.push(buildTopBorder(box, width, options.title, options.titleAlign, colorize));

  // Top padding
  for (let i = 0; i < padding; i++) {
    lines.push(emptyLine);
  }

  // Content lines
  for (const line of contentLines) {
    const lineWidth = getStringWidth(line);
    const rightPadding = Math.max(0, contentWidth - lineWidth);
    lines.push(
      colorize(box.vertical) +
        paddingStr +
        line +
        ' '.repeat(rightPadding) +
        paddingStr +
        colorize(box.vertical)
    );
  }

  // Bottom padding
  for (let i = 0; i < padding; i++) {
    lines.push(emptyLine);
  }

  // Bottom border
  lines.push(buildBottomBorder(box, width, colorize));

  return lines.join('\n');
}

function buildTopBorder(
  box: BoxStyle,
  width: number,
  title?: string,
  titleAlign?: 'left' | 'center' | 'right',
  colorize?: (text: string) => string
): string {
  const color = colorize ?? ((t: string) => t);
  const innerWidth = width - 2; // minus corners

  if (!title) {
    return color(box.topLeft + box.horizontal.repeat(innerWidth) + box.topRight);
  }

  const titleWidth = getStringWidth(title);
  const paddedTitle = ` ${title} `;
  const paddedTitleWidth = titleWidth + 2;

  if (paddedTitleWidth >= innerWidth) {
    // Title too long, just show it
    return color(box.topLeft + paddedTitle.slice(0, innerWidth) + box.topRight);
  }

  const remainingWidth = innerWidth - paddedTitleWidth;
  let leftWidth: number;
  let rightWidth: number;

  switch (titleAlign) {
    case 'right':
      leftWidth = remainingWidth - 1;
      rightWidth = 1;
      break;
    case 'center':
      leftWidth = Math.floor(remainingWidth / 2);
      rightWidth = remainingWidth - leftWidth;
      break;
    case 'left':
    default:
      leftWidth = 1;
      rightWidth = remainingWidth - 1;
      break;
  }

  return (
    color(box.topLeft) +
    color(box.horizontal.repeat(leftWidth)) +
    paddedTitle +
    color(box.horizontal.repeat(rightWidth)) +
    color(box.topRight)
  );
}

function buildBottomBorder(
  box: BoxStyle,
  width: number,
  colorize?: (text: string) => string
): string {
  const color = colorize ?? ((t: string) => t);
  const innerWidth = width - 2;
  return color(box.bottomLeft + box.horizontal.repeat(innerWidth) + box.bottomRight);
}

/**
 * Preset panel types with theme colors
 */
export type PanelType = 'message' | 'response' | 'error' | 'warning' | 'info' | 'success';

export function buildThemedPanel(
  content: string,
  type: PanelType,
  options: Omit<PanelOptions, 'borderColor'> = {},
  theme: Theme = defaultTheme
): string {
  const borderColor = theme[type];
  return buildPanel(content, { ...options, borderColor });
}
