import { cursor, line, rgb, resetFg, getColorRgb, lerpColor, type RGB } from './terminal.js';

export interface ThinkingIndicatorOptions {
  /** Base color name (default: 'cyan') */
  color?: string;
  /** Enable gradient sweep animation (default: true) */
  shimmer?: boolean;
  /** Animation interval in ms (default: 50) */
  interval?: number;
  /** Optional prefix text before the animated text */
  prefix?: string;
}

/**
 * Animated thinking indicator with gradient sweep effect
 *
 * @example
 * ```ts
 * const thinking = new ThinkingIndicator('Thinking...', { shimmer: true })
 * thinking.start()
 * // ... async work ...
 * thinking.stop()
 * ```
 */
export class ThinkingIndicator {
  private intervalId?: ReturnType<typeof setInterval>;
  private sweepPosition = 0;
  private text: string;
  private options: Required<ThinkingIndicatorOptions>;
  private isRunning = false;

  constructor(text: string, options: ThinkingIndicatorOptions = {}) {
    this.text = text;
    this.options = {
      color: options.color ?? 'cyan',
      shimmer: options.shimmer ?? true,
      interval: options.interval ?? 50,
      prefix: options.prefix ?? '',
    };
  }

  /**
   * Start the animation
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.sweepPosition = 0;

    cursor.hide();
    this.render();

    if (this.options.shimmer) {
      this.intervalId = setInterval(() => {
        this.sweepPosition++;
        this.render();
      }, this.options.interval);
    }
  }

  /**
   * Stop the animation and clear the line
   */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    line.clear();
    cursor.toStart();
    cursor.show();
  }

  /**
   * Update the text while running
   */
  setText(text: string): void {
    this.text = text;
    if (this.isRunning) {
      this.render();
    }
  }

  private render(): void {
    const fullText = this.options.prefix + this.text;
    const output = this.options.shimmer
      ? this.applyGradientSweep(fullText)
      : this.applyStaticColor(fullText);

    line.clear();
    cursor.toStart();
    process.stdout.write(output);
  }

  private applyStaticColor(text: string): string {
    const color = getColorRgb(this.options.color);
    return rgb(color.r, color.g, color.b) + text + resetFg;
  }

  private applyGradientSweep(text: string): string {
    const baseColor = getColorRgb(this.options.color);

    // Highlight color: brighter version of base color
    const highlightColor: RGB = {
      r: Math.min(255, baseColor.r + 100),
      g: Math.min(255, baseColor.g + 100),
      b: Math.min(255, baseColor.b + 100),
    };

    // Dim color: dimmer version of base color
    const dimColor: RGB = {
      r: Math.max(0, baseColor.r - 80),
      g: Math.max(0, baseColor.g - 80),
      b: Math.max(0, baseColor.b - 80),
    };

    // Sweep width in characters
    const sweepWidth = 8;

    // Normalize position to loop through text + some padding
    const totalLength = text.length + sweepWidth * 2;
    const normalizedPos = this.sweepPosition % totalLength;

    let output = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Calculate distance from the sweep center
      const distance = Math.abs(i - normalizedPos + sweepWidth);

      // Calculate brightness based on distance (cosine falloff for smooth transition)
      let brightness: number;
      if (distance < sweepWidth) {
        // Use cosine for smooth falloff
        brightness = Math.cos((distance / sweepWidth) * (Math.PI / 2));
      } else {
        brightness = 0;
      }

      // Interpolate between dim and highlight based on brightness
      const color = lerpColor(dimColor, highlightColor, brightness);
      output += rgb(color.r, color.g, color.b) + char;
    }

    return output + resetFg;
  }
}
