// Core components
export { Panel } from './components/Panel.js';
export type { PanelProps } from './components/Panel.js';

export {
  MessagePanel,
  ResponsePanel,
  ReasoningPanel,
  ToolCallsPanel,
  ErrorPanel,
  WarningPanel,
} from './components/ThemedPanels.js';

export { ProgressSpinner, DotsSpinner } from './components/Spinner.js';
export type { ProgressSpinnerProps } from './components/Spinner.js';

// Hooks
export { useStreamingContent, useTimer } from './hooks/useStreamingContent.js';
export type { StreamingOptions, StreamingState } from './hooks/useStreamingContent.js';

// Presets
export { AgentResponse, SimpleResponse } from './presets/AgentResponse.js';
export type { AgentResponseProps } from './presets/AgentResponse.js';

// Box styles
export { HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD, BOX_STYLES, getBoxStyle } from './boxes/styles.js';
export type { BoxStyle } from './boxes/styles.js';

// Themes
export { defaultTheme, agnoTheme, darkTheme, lightTheme, getTheme } from './themes/default.js';
export type { Theme, ThemeName } from './themes/types.js';

// Utilities
export {
  getTerminalWidth,
  wrapText,
  getStringWidth,
  padString,
  truncateString,
} from './utils/wrap.js';

export { escapeSpecialTags, stripTags, extractTagContent } from './utils/escape.js';

export { renderMarkdown, containsMarkdown } from './utils/markdown.js';

// Re-export commonly used Ink components for convenience
export { render, Box, Text, Spacer, Static, Newline } from 'ink';
