/**
 * Streaming components for Parlor Simple API
 */

// Terminal utilities
export {
  cursor,
  line,
  rgb,
  bgRgb,
  resetFg,
  resetBg,
  reset,
  lerpColor,
  getColorRgb,
  colors,
  type RGB,
} from './terminal.js';

// ThinkingIndicator
export { ThinkingIndicator, type ThinkingIndicatorOptions } from './ThinkingIndicator.js';

// StreamingPanel
export { StreamingPanel, type StreamingPanelOptions } from './StreamingPanel.js';

// ReasoningPanel
export { ReasoningPanel, type ReasoningPanelOptions } from './ReasoningPanel.js';

// Stream extractors
export { StreamExtractors, type StreamExtractor, type StreamChunk } from './extractors.js';

// Stream response helpers
export {
  streamResponse,
  streamMastraResponse,
  type StreamResponseOptions,
  type StreamResult,
} from './streamResponse.js';
