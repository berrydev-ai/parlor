import { buildPanel, buildThemedPanel, type PanelOptions } from './renderer.js';
import { buildHeader, type HeaderOptions } from './templates/header.js';
import { buildDescriptionList, type DescriptionListOptions } from './templates/dl.js';
import { buildList, type ListOptions } from './templates/list.js';
import { buildCode, type CodeOptions } from './templates/code.js';
import { buildFiglet, type FigletOptions } from './templates/figlet.js';
import { defaultTheme, type Theme } from '../themes/default.js';

export interface ParlorBuilderOptions {
  theme?: Theme;
  width?: number;
}

/**
 * Fluent API builder for creating rich console output
 *
 * @example
 * ```ts
 * parlor()
 *   .header("My App")
 *   .message("User input here")
 *   .response("AI response")
 *   .dl({ Version: "1.0", Author: "You" })
 *   .render()
 * ```
 */
export class ParlorBuilder {
  private segments: string[] = [];
  private theme: Theme;
  private defaultWidth?: number;

  constructor(options: ParlorBuilderOptions = {}) {
    this.theme = options.theme ?? defaultTheme;
    this.defaultWidth = options.width;
  }

  /**
   * Add a header divider
   */
  header(title: string, options?: HeaderOptions): this {
    const opts = { ...options };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    this.segments.push(buildHeader(title, opts));
    return this;
  }

  /**
   * Add ASCII art text using figlet
   */
  figlet(text: string, options?: FigletOptions): this {
    this.segments.push(buildFiglet(text, options));
    return this;
  }

  /**
   * Add a message panel (cyan border)
   */
  message(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'message', opts, this.theme));
    return this;
  }

  /**
   * Add a response panel (blue border)
   */
  response(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'response', opts, this.theme));
    return this;
  }

  /**
   * Add an error panel (red border)
   */
  error(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'error', opts, this.theme));
    return this;
  }

  /**
   * Add a warning panel (yellow border)
   */
  warn(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'warning', opts, this.theme));
    return this;
  }

  /**
   * Add an info panel (blue border)
   */
  info(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'info', opts, this.theme));
    return this;
  }

  /**
   * Add a success panel (green border)
   */
  success(content: string, options?: Omit<PanelOptions, 'borderColor'>): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildThemedPanel(content, 'success', opts, this.theme));
    return this;
  }

  /**
   * Add a custom panel with specified options
   */
  panel(content: string, options?: PanelOptions): this {
    const opts = this.applyDefaults(options);
    this.segments.push(buildPanel(content, opts));
    return this;
  }

  /**
   * Add a description list (key-value pairs)
   */
  dl(data: Record<string, string | number | boolean>, options?: DescriptionListOptions): this {
    const opts = { ...options };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    this.segments.push(buildDescriptionList(data, opts));
    return this;
  }

  /**
   * Add a bullet list
   */
  list(items: string[], options?: ListOptions): this {
    const opts = { ...options };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    this.segments.push(buildList(items, opts));
    return this;
  }

  /**
   * Add a numbered list
   */
  numberedList(items: string[], options?: Omit<ListOptions, 'numbered'>): this {
    const opts = { ...options, numbered: true };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    this.segments.push(buildList(items, opts));
    return this;
  }

  /**
   * Add a syntax-highlighted code block
   */
  code(content: string, language?: string, options?: Omit<CodeOptions, 'language'>): this {
    const opts = { ...options, language };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    this.segments.push(buildCode(content, opts));
    return this;
  }

  /**
   * Add raw text without any formatting
   */
  text(content: string): this {
    this.segments.push(content);
    return this;
  }

  /**
   * Add an empty line
   */
  newline(): this {
    this.segments.push('');
    return this;
  }

  /**
   * Convert all segments to a string
   */
  toString(): string {
    return this.segments.join('\n');
  }

  /**
   * Render output to stdout
   */
  render(): void {
    const output = this.toString();
    if (output) {
      process.stdout.write(output + '\n');
    }
  }

  /**
   * Clear all segments
   */
  clear(): this {
    this.segments = [];
    return this;
  }

  private applyDefaults(
    options?: Omit<PanelOptions, 'borderColor'>
  ): Omit<PanelOptions, 'borderColor'> {
    const opts = { ...options };
    if (this.defaultWidth && !opts.width) opts.width = this.defaultWidth;
    return opts;
  }
}
