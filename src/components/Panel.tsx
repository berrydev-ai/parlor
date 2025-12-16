import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { getBoxStyle, BoxStyle } from '../boxes/styles.js';
import { getTerminalWidth, getStringWidth, wrapText } from '../utils/wrap.js';
import { renderMarkdown, containsMarkdown } from '../utils/markdown.js';

export interface PanelProps {
  children: React.ReactNode;
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  borderColor?: string;
  padding?: number | [number, number]; // [vertical, horizontal]
  expand?: boolean;
  width?: number;
  maxWidth?: number; // Maximum width constraint (e.g., 150 for 150 characters)
}

/**
 * Panel component - creates a bordered box with optional title
 * Matches Python Rich Panel behavior
 */
export function Panel({
  children,
  title,
  titleAlign = 'left',
  borderStyle = 'heavy',
  borderColor = 'blue',
  padding = 1,
  expand = true,
  width,
  maxWidth,
}: PanelProps) {
  const box = getBoxStyle(borderStyle);
  let terminalWidth = width || (expand ? getTerminalWidth() : undefined);

  // Apply maxWidth constraint if specified
  if (maxWidth && terminalWidth && terminalWidth > maxWidth) {
    terminalWidth = maxWidth;
  } else if (maxWidth && !terminalWidth) {
    terminalWidth = maxWidth;
  }

  // Calculate padding values
  const [verticalPadding, horizontalPadding] =
    typeof padding === 'number' ? [padding, padding] : padding;

  // Create color function
  const colorize = (str: string) => {
    if (!borderColor) return str;
    return (chalk as unknown as Record<string, (s: string) => string>)[borderColor]?.(str) || str;
  };

  return (
    <Box flexDirection="column" width={terminalWidth}>
      {/* Top border with optional title */}
      <TopBorder
        box={box}
        title={title}
        titleAlign={titleAlign}
        colorize={colorize}
        width={terminalWidth}
      />
      {/* Content rows with side borders */}
      <ContentWithBorders
        box={box}
        colorize={colorize}
        width={terminalWidth}
        horizontalPadding={horizontalPadding}
        verticalPadding={verticalPadding}
      >
        {children}
      </ContentWithBorders>
      {/* Bottom border */}
      <BottomBorder box={box} colorize={colorize} width={terminalWidth} />
    </Box>
  );
}

interface BorderProps {
  box: BoxStyle;
  colorize: (str: string) => string;
  width?: number;
}

interface TopBorderProps extends BorderProps {
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
}

function TopBorder({ box, title, titleAlign = 'left', colorize, width }: TopBorderProps) {
  const termWidth = width || getTerminalWidth();

  if (!title) {
    // Simple top border without title
    const line = box.topLeft + box.horizontal.repeat(termWidth - 2) + box.topRight;
    return <Text>{colorize(line)}</Text>;
  }

  // Top border with title
  const titleText = ` ${title} `;
  const titleWidth = getStringWidth(titleText);
  const availableWidth = termWidth - 2; // Subtract corners

  let leftPad = 1;
  let rightPad = availableWidth - titleWidth - leftPad;

  if (titleAlign === 'center') {
    leftPad = Math.floor((availableWidth - titleWidth) / 2);
    rightPad = availableWidth - titleWidth - leftPad;
  } else if (titleAlign === 'right') {
    leftPad = availableWidth - titleWidth - 1;
    rightPad = 1;
  }

  const line =
    box.topLeft +
    box.horizontal.repeat(leftPad) +
    titleText +
    box.horizontal.repeat(Math.max(0, rightPad)) +
    box.topRight;

  return <Text>{colorize(line)}</Text>;
}

function BottomBorder({ box, colorize, width }: BorderProps) {
  const termWidth = width || getTerminalWidth();
  const line = box.bottomLeft + box.horizontal.repeat(termWidth - 2) + box.bottomRight;
  return <Text>{colorize(line)}</Text>;
}

interface ContentWithBordersProps extends BorderProps {
  children: React.ReactNode;
  horizontalPadding: number;
  verticalPadding: number;
}

function ContentWithBorders({
  box,
  colorize,
  width,
  children,
  horizontalPadding,
  verticalPadding,
}: ContentWithBordersProps) {
  const termWidth = width || getTerminalWidth();
  const innerWidth = termWidth - 2; // Width between the vertical borders
  const contentWidth = innerWidth - horizontalPadding * 2; // Width for actual content

  const paddingStr = ' '.repeat(horizontalPadding);

  // Helper to create a bordered line
  const createBorderedLine = (content: string): string => {
    const contentLen = getStringWidth(content);
    const rightPadding = Math.max(0, contentWidth - contentLen);
    return (
      colorize(box.vertical) +
      paddingStr +
      content +
      ' '.repeat(rightPadding) +
      paddingStr +
      colorize(box.vertical)
    );
  };

  // Empty line for padding
  const emptyLine = createBorderedLine('');

  // Extract all text content from a node, concatenating siblings
  const extractText = (node: React.ReactNode): string => {
    let text = '';

    React.Children.forEach(node, (child) => {
      if (child === null || child === undefined) return;

      if (typeof child === 'string' || typeof child === 'number') {
        text += String(child);
      } else if (React.isValidElement(child)) {
        // Handle Text components - extract their children
        const props = child.props as { children?: React.ReactNode };
        if (props.children !== undefined) {
          text += extractText(props.children);
        }
      }
    });

    return text;
  };

  // Process text with markdown rendering
  const processMarkdownText = (text: string): string[] => {
    // Check if text contains markdown - if so, render it
    if (containsMarkdown(text)) {
      // Pass contentWidth for full-width code block backgrounds
      const rendered = renderMarkdown(text, contentWidth);
      // Split rendered markdown into lines
      // The rendered text contains ANSI codes for styling
      // Don't re-wrap lines that contain ANSI codes (code blocks)
      const lines = rendered.split('\n');
      const result: string[] = [];

      for (const line of lines) {
        // Check if line contains ANSI escape codes (styled content like code blocks)
        // eslint-disable-next-line no-control-regex
        const hasAnsiCodes = /\x1b\[/.test(line);
        if (hasAnsiCodes) {
          // Don't wrap styled lines - they're pre-formatted (code blocks, etc.)
          result.push(line);
        } else if (line.trim() === '') {
          // Preserve empty lines
          result.push('');
        } else {
          // Wrap non-styled text
          const wrapped = wrapText(line, contentWidth);
          result.push(...wrapped);
        }
      }

      return result;
    }

    // No markdown, just wrap the text
    return wrapText(text, contentWidth);
  };

  // Process children and extract text content as lines
  const processChildren = (node: React.ReactNode): string[] => {
    const lines: string[] = [];

    React.Children.forEach(node, (child) => {
      if (child === null || child === undefined) return;

      if (typeof child === 'string' || typeof child === 'number') {
        // Direct string child - process with markdown awareness
        const text = String(child);
        const processed = processMarkdownText(text);
        lines.push(...processed);
      } else if (React.isValidElement(child)) {
        // For React elements (like Text), extract all text content as a single string
        // then process it. This handles cases like <Text>• {name}({args})</Text>
        const props = child.props as { children?: React.ReactNode };
        if (props.children !== undefined) {
          const fullText = extractText(props.children);
          const processed = processMarkdownText(fullText);
          lines.push(...processed);
        }
      }
    });

    return lines;
  };

  const contentLines = processChildren(children);

  // Build all lines with borders
  const allLines: string[] = [];

  // Add top padding
  for (let i = 0; i < verticalPadding; i++) {
    allLines.push(emptyLine);
  }

  // Add content lines
  for (const line of contentLines) {
    allLines.push(createBorderedLine(line));
  }

  // Add bottom padding
  for (let i = 0; i < verticalPadding; i++) {
    allLines.push(emptyLine);
  }

  return <Text>{allLines.join('\n')}</Text>;
}
