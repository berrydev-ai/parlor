import { cursor, line } from './terminal.js';
import { buildPanel, type PanelOptions } from '../renderer.js';

export interface StreamingPanelOptions {
  /** Panel title */
  title?: string;
  /** Title alignment */
  titleAlign?: 'left' | 'center' | 'right';
  /** Border style */
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  /** Border color */
  borderColor?: string;
  /** Panel width (default: terminal width) */
  width?: number;
  /** Maximum panel width */
  maxWidth?: number;
  /** Padding inside panel */
  padding?: number;
}

/**
 * A panel that progressively renders streaming content
 *
 * @example
 * ```ts
 * const panel = new StreamingPanel({ title: 'Response', borderStyle: 'rounded' })
 * panel.start()
 * for await (const chunk of stream) {
 *   panel.append(chunk.text)
 * }
 * panel.finish()
 * ```
 */
// Default max width to prevent excessively wide panels
const DEFAULT_MAX_WIDTH = 120;

export class StreamingPanel {
  private content = '';
  private lineCount = 0;
  private isActive = false;
  private options: StreamingPanelOptions;

  constructor(options: StreamingPanelOptions = {}) {
    this.options = {
      ...options,
      maxWidth: options.maxWidth ?? DEFAULT_MAX_WIDTH,
    };
  }

  /**
   * Start the panel (draws initial frame)
   */
  start(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.content = '';
    this.lineCount = 0;

    cursor.hide();
    this.render();
  }

  /**
   * Append text to the panel content
   */
  append(text: string): void {
    if (!text) return;
    this.content += text;
    if (this.isActive) {
      this.render();
    }
  }

  /**
   * Set the entire content (replaces existing)
   */
  setContent(content: string): void {
    this.content = content;
    if (this.isActive) {
      this.render();
    }
  }

  /**
   * Get the current content
   */
  getContent(): string {
    return this.content;
  }

  /**
   * Finish the panel (final render, show cursor)
   */
  finish(): void {
    if (!this.isActive) return;
    this.isActive = false;

    // Final render to ensure clean state
    this.render();
    cursor.show();
    process.stdout.write('\n');
  }

  /**
   * Clear and close the panel without final render
   */
  clear(): void {
    if (!this.isActive) return;
    this.isActive = false;

    // Erase the panel
    if (this.lineCount > 0) {
      line.eraseLines(this.lineCount);
    }
    this.lineCount = 0;
    cursor.show();
  }

  private render(): void {
    // Erase previous content
    if (this.lineCount > 0) {
      line.eraseLines(this.lineCount);
    }

    // Build panel options
    const panelOptions: PanelOptions = {
      title: this.options.title,
      titleAlign: this.options.titleAlign,
      borderStyle: this.options.borderStyle,
      borderColor: this.options.borderColor,
      width: this.options.width,
      maxWidth: this.options.maxWidth,
      padding: this.options.padding,
    };

    // Build and render panel
    // Use a placeholder if content is empty to ensure panel is visible
    const displayContent = this.content || ' ';
    const panel = buildPanel(displayContent, panelOptions);

    process.stdout.write(panel);

    // Count lines for next erase
    this.lineCount = panel.split('\n').length;
  }
}
