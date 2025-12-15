# Changelog

All notable changes to Parlor will be documented in this file.

## [0.1.0] - 2025-12-15

### Added
- Initial release
- Core Panel component with customizable borders
- Pre-styled themed panels (Message, Response, Reasoning, ToolCalls, Error, Warning)
- Progress spinner with custom animation (▰▰▰▰▱▱▱ style)
- Dots spinner component
- Streaming content hook (`useStreamingContent`)
- Timer hook (`useTimer`)
- AgentResponse preset component
- SimpleResponse preset component
- Box drawing styles (HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD)
- Default theme system matching Agno colors
- Terminal width detection (cross-runtime: Bun, Node, Deno)
- Text wrapping utilities
- Tag escaping utilities
- Full TypeScript support with type definitions
- Comprehensive examples
- Documentation (README, GETTING_STARTED, STATUS)

### Features
- ✅ Streaming support for LLM responses
- ✅ Real-time content updates
- ✅ Async iterator consumption
- ✅ Elapsed time tracking
- ✅ Cross-runtime compatibility
- ✅ Flexible theming

### Known Limitations
- No markdown rendering yet
- No table support yet
- Basic error handling in streams

## [Unreleased]

### Planned
- Markdown rendering component
- JSON syntax highlighting
- Table component
- Better error handling
- Performance optimizations
- Unit tests
- npm publication
