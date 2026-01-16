import figlet from 'figlet';
import { createColorizer } from '../utils/color.js';

export interface FigletOptions {
  font?: figlet.Fonts;
  color?: string;
  horizontalLayout?: figlet.KerningMethods;
  verticalLayout?: figlet.KerningMethods;
}

/**
 * Build ASCII art text using figlet
 * This is synchronous - uses figlet.textSync
 */
export function buildFiglet(text: string, options: FigletOptions = {}): string {
  const color = options.color ?? 'white';
  const colorize = createColorizer(color);

  try {
    const result = figlet.textSync(text, {
      font: options.font ?? 'Standard',
      horizontalLayout: options.horizontalLayout ?? 'default',
      verticalLayout: options.verticalLayout ?? 'default',
    });

    return colorize(result);
  } catch {
    // Fallback to plain text if figlet fails
    return colorize(text);
  }
}

/**
 * Get list of available figlet fonts
 */
export function getFigletFonts(): string[] {
  return figlet.fontsSync();
}
