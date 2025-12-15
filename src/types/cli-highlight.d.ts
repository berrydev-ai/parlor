declare module 'cli-highlight' {
  export interface HighlightOptions {
    language?: string;
    ignoreIllegals?: boolean;
    theme?: Record<string, string>;
  }

  export function highlight(code: string, options?: HighlightOptions): string;
  export function supportsLanguage(language: string): boolean;
  export function listLanguages(): string[];
}
