/**
 * Theme type definitions for Parlor
 */

export interface Theme {
  message: string;
  response: string;
  reasoning: string;
  toolCalls: string;
  citations: string;
  error: string;
  team: string;
  warning: string;
  info: string;
  success: string;
}

export type ThemeName = 'default' | 'agno' | 'dark' | 'light';
