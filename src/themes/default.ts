import type { Theme } from './types.js';

// Re-export Theme type for convenience
export type { Theme };

/**
 * Default theme matching Agno's color scheme
 */
export const defaultTheme: Theme = {
  message: 'cyan',
  response: 'blue',
  reasoning: 'green',
  toolCalls: 'yellow',
  citations: 'green',
  error: 'red',
  team: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
};

/**
 * Agno theme (alias for default)
 */
export const agnoTheme: Theme = { ...defaultTheme };

/**
 * Dark theme variant
 */
export const darkTheme: Theme = {
  message: 'cyanBright',
  response: 'blueBright',
  reasoning: 'greenBright',
  toolCalls: 'yellowBright',
  citations: 'greenBright',
  error: 'redBright',
  team: 'magentaBright',
  warning: 'yellowBright',
  info: 'blueBright',
  success: 'greenBright',
};

/**
 * Light theme variant
 */
export const lightTheme: Theme = {
  message: 'cyan',
  response: 'blue',
  reasoning: 'green',
  toolCalls: 'yellow',
  citations: 'green',
  error: 'red',
  team: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
};

/**
 * Get theme by name
 */
export function getTheme(name: string = 'default'): Theme {
  switch (name.toLowerCase()) {
    case 'agno':
      return agnoTheme;
    case 'dark':
      return darkTheme;
    case 'light':
      return lightTheme;
    case 'default':
    default:
      return defaultTheme;
  }
}
