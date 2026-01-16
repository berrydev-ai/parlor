/**
 * Simple console.log-style API for Parlor
 *
 * @example
 * ```ts
 * import { parlor } from '@berrydev-ai/parlor/simple'
 *
 * parlor()
 *   .header("My App")
 *   .message("Hello, world!")
 *   .render()
 * ```
 */

import { ParlorBuilder, type ParlorBuilderOptions } from './ParlorBuilder.js';

// Re-export the builder and types
export { ParlorBuilder, type ParlorBuilderOptions } from './ParlorBuilder.js';

// Re-export renderer utilities
export { buildPanel, buildThemedPanel, type PanelOptions, type PanelType } from './renderer.js';

// Re-export template builders
export { buildHeader, type HeaderOptions } from './templates/header.js';
export { buildDescriptionList, type DescriptionListOptions } from './templates/dl.js';
export { buildList, type ListOptions } from './templates/list.js';
export { buildCode, type CodeOptions } from './templates/code.js';
export { buildFiglet, getFigletFonts, type FigletOptions } from './templates/figlet.js';

// Re-export themes for customization
export { defaultTheme, darkTheme, lightTheme, agnoTheme, getTheme } from '../themes/default.js';
export type { Theme } from '../themes/types.js';

/**
 * Create a new ParlorBuilder instance for fluent API usage
 *
 * @example
 * ```ts
 * // Basic usage
 * parlor()
 *   .header("Status")
 *   .message("User query")
 *   .response("AI response")
 *   .render()
 *
 * // Get as string
 * const output = parlor()
 *   .success("Task completed!")
 *   .toString()
 *
 * // With custom theme
 * parlor({ theme: darkTheme })
 *   .error("Something went wrong")
 *   .render()
 * ```
 */
export function parlor(options?: ParlorBuilderOptions): ParlorBuilder {
  return new ParlorBuilder(options);
}

// Default export for convenience
export default parlor;
