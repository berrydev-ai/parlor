# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-01-16

### Added

- **Streaming Support for Simple API** - New streaming components for real-time LLM response rendering:
  - `ThinkingIndicator` - Animated text with gradient sweep effect for "thinking" states
  - `StreamingPanel` - Progressive panel rendering with append-only updates
  - `ReasoningPanel` - Dedicated panel for displaying reasoning/thinking content
  - `streamResponse()` - High-level helper for streaming LLM responses
  - `streamMastraResponse()` - Convenience wrapper for Mastra agent streams
  - `StreamExtractors` - Pre-built extractors for OpenAI, Anthropic, Mastra, and AI SDK formats
  - Terminal utilities (`cursor`, `line`, `rgb`, etc.) for advanced users

### Fixed

- **Panel alignment in streaming output** - Fixed `eraseLines` function to correctly clear lines during progressive rendering
- **Default maxWidth of 120** - All output components now default to 120 character max width to prevent excessively wide output on wide terminals:
  - `buildPanel` (renderer)
  - `buildHeader`
  - `buildList`
  - `buildDescriptionList`
  - `buildCode`
  - `StreamingPanel`
- **Package exports structure** - Improved exports with proper nested `import`/`require` blocks for correct TypeScript type resolution in both ESM and CJS contexts

## [0.2.0] - 2025-01-15

### Added

- **Simple API** (`@berrydev-ai/parlor/simple`) - Fluent builder pattern for console output without React:
  - `parlor()` - Entry point for fluent API
  - `header()` - Section dividers
  - `message()`, `response()`, `error()`, `warn()`, `info()`, `success()` - Themed panels
  - `dl()` - Description lists (key-value pairs)
  - `list()`, `numberedList()` - Bullet and numbered lists
  - `code()` - Syntax-highlighted code blocks
  - `figlet()` - ASCII art text
  - `panel()` - Custom panels
- `maxWidth` prop to Panel component for configurable width limiting

### Fixed

- Module exports to match actual build output

## [0.1.0] - 2025-01-14

### Added

- Initial release
- React/Ink-based components: `Panel`, `MessagePanel`, `ResponsePanel`, `ErrorPanel`, `WarningPanel`, `InfoPanel`, `SuccessPanel`
- `AgentResponse` and `SimpleResponse` presets
- `useStreamingContent` hook for streaming support
- Markdown rendering with syntax highlighting
- Multiple border styles: heavy, single, double, rounded, bold
- Theming support with default, dark, light, and agno themes
