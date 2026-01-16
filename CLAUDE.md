# Parlor - Claude Development Guide

This document provides comprehensive guidance for Claude Code (or any AI assistant) working on the Parlor project.

## Project Overview

**Parlor** is a TypeScript library for creating rich, interactive console output similar to Python's Rich library. It's optimized for AI agent responses with real-time streaming support.

**Key Characteristics:**
- Built on Ink (React for terminals)
- Streaming-first design for LLM responses
- TypeScript with full type safety
- Cross-runtime support (Bun, Node.js, Deno)
- Inspired by Agno's terminal UI aesthetic

## Project Structure

```
/Users/eberry/Code/github.com/berrydev-ai/parlor/
├── src/
│   ├── components/         # React components for terminal UI
│   │   ├── Panel.tsx       # Core bordered panel component
│   │   ├── ThemedPanels.tsx # Pre-styled semantic panels
│   │   └── Spinner.tsx     # Animated progress indicators
│   ├── hooks/
│   │   └── useStreamingContent.ts # Async iterator consumer
│   ├── boxes/
│   │   └── styles.ts       # Box drawing character sets
│   ├── themes/
│   │   ├── types.ts        # Theme type definitions
│   │   └── default.ts      # Color schemes
│   ├── utils/
│   │   ├── wrap.ts         # Text wrapping utilities
│   │   └── escape.ts       # Tag escaping
│   ├── presets/
│   │   └── AgentResponse.tsx # Complete agent response layout
│   └── index.ts            # Main exports
├── examples/               # Example implementations
├── notes/                  # Temporary notes for Claude Code
├── INSTRUCTIONS.md         # Original implementation plan
├── API.md                  # Complete API reference
├── STATUS.md               # Current project status
└── README.md              # User-facing documentation
```

## Architecture & Design Decisions

### 1. Technology Stack

**Core Dependencies:**
- `ink` (v4.4.1) - React renderer for terminals, provides component model
- `react` (v18.2.0) - Required by Ink
- `chalk` (v5.3.0) - Terminal string styling
- `cli-boxes` (v3.0.0) - Box drawing characters
- `marked` (v11.0.0) - Markdown parser (future use)
- `marked-terminal` (v7.2.0) - Terminal markdown renderer (future use)

**Dev Dependencies:**
- `typescript` (v5.3.0)
- `tsup` (v8.0.0) - Build tool for dual ESM/CJS output
- `bun` - Primary runtime (also supports Node.js/Deno)

### 2. Core Components

**Panel Component** (`src/components/Panel.tsx`)
- Base component for all bordered boxes
- Supports multiple border styles: heavy, single, double, rounded, bold
- Handles title positioning (left, center, right)
- Manages padding (single value or [vertical, horizontal] tuple)
- Auto-expands to terminal width by default
- Uses Ink's Box component for layout

**Themed Panels** (`src/components/ThemedPanels.tsx`)
- Semantic wrappers around Panel with preset colors
- MessagePanel (cyan) - User input
- ResponsePanel (blue) - AI responses, includes elapsed time
- ReasoningPanel (green) - Thinking/reasoning steps
- ToolCallsPanel (yellow) - Tool execution logs
- ErrorPanel (red) - Error messages
- WarningPanel (yellow) - Warning messages

**Spinner Component** (`src/components/Spinner.tsx`)
- ProgressSpinner - Custom animated progress bar (▰▰▰▰▱▱▱ style)
- DotsSpinner - Standard dots animation
- Both support customizable text, colors, and animation frames

### 3. Hooks

**useStreamingContent** (`src/hooks/useStreamingContent.ts`)
- Consumes AsyncIterator<T> or AsyncIterable<T>
- Tracks streaming state (content, isStreaming, elapsed, error)
- Provides lifecycle callbacks (onChunk, onComplete, onError)
- Generic extractContent function to adapt any stream format
- Uses React state and useEffect for real-time updates

**useTimer** (inside useStreamingContent)
- Simple elapsed time tracker
- Updates every second when active
- Returns time in seconds as a number

### 4. Box Drawing System

Located in `src/boxes/styles.ts`, defines character sets for borders:

```typescript
export const HEAVY = {
  topLeft: '┏', topRight: '┓',
  bottomLeft: '┗', bottomRight: '┛',
  horizontal: '━', vertical: '┃'
};
// Also: SINGLE, DOUBLE, ROUNDED, BOLD
```

Each style provides 6 characters: corners (4) + horizontal/vertical lines (2).

### 5. Theme System

**Types** (`src/themes/types.ts`):
```typescript
interface Theme {
  message: string;      // User input color
  response: string;     // AI response color
  reasoning: string;    // Thinking/reasoning color
  toolCalls: string;    // Tool execution color
  citations: string;    // Source references color
  error: string;        // Error messages color
  team: string;         // Multi-agent color
  warning: string;      // Warning color
  info: string;         // Info messages color
  success: string;      // Success messages color
}
```

**Default Theme** (`src/themes/default.ts`):
- Matches Agno's color scheme
- Cyan for messages, blue for responses, green for reasoning
- Yellow for tools/warnings, red for errors, magenta for teams

### 6. Utilities

**Text Wrapping** (`src/utils/wrap.ts`):
- `getTerminalWidth()` - Cross-runtime terminal width detection
- `wrapText(text, width)` - ANSI-aware text wrapping
- `getStringWidth(str)` - Width calculation ignoring ANSI codes
- `padString(str, width, char)` - Pad string to width
- `truncateString(str, width)` - Truncate with ellipsis

**Tag Escaping** (`src/utils/escape.ts`):
- `escapeSpecialTags(text)` - Escape XML/HTML-like tags
- `stripTags(text)` - Remove all tags from text
- `extractTagContent(text, tagName)` - Extract content from specific tags
- Useful for handling LLM output with special formatting

## Development Workflow

### Building

```bash
# Development mode (watch)
bun run dev

# Production build
bun run build
```

Output: `dist/index.cjs` (CJS), `dist/index.js` (ESM), `dist/index.d.cts` (CJS types), `dist/index.d.ts` (ESM types)

### Running Examples

```bash
bun run example:basic      # All panel types
bun run example:streaming  # Streaming response demo
bun run example:agent      # Complete agent workflow
bun run example:advanced   # Advanced features
bun run example:openai     # OpenAI integration (future)
```

### Testing

```bash
bun test
```

Currently no tests implemented (Phase 3 task).

## Key Implementation Patterns

### 1. Streaming Pattern

All streaming components follow this pattern:

```tsx
function StreamingComponent({ stream }) {
  const { content, isStreaming, elapsed } = useStreamingContent({
    iterator: stream,
    extractContent: (chunk) => chunk.content || chunk.delta?.content || '',
  });

  return (
    <ResponsePanel elapsed={elapsed}>
      <Text>{content}</Text>
    </ResponsePanel>
  );
}
```

### 2. Border Rendering

Borders are rendered by calculating terminal width and constructing strings:

```tsx
// Top border with title
const topBorder = 
  box.topLeft + 
  box.horizontal + 
  ` ${title} ` + 
  box.horizontal.repeat(width - title.length - 4) +
  box.topRight;
```

### 3. Panel Composition

Panels use Ink's Box component for layout:

```tsx
<Box flexDirection="column" width={width}>
  <Text color={borderColor}>{topBorder}</Text>
  <Box>
    <Text color={borderColor}>{box.vertical}</Text>
    <Box paddingX={paddingH} paddingY={paddingV}>
      {children}
    </Box>
    <Text color={borderColor}>{box.vertical}</Text>
  </Box>
  <Text color={borderColor}>{bottomBorder}</Text>
</Box>
```

## Common Tasks

### Adding a New Panel Type

1. Add color to theme in `src/themes/types.ts`
2. Update default theme in `src/themes/default.ts`
3. Create component in `src/components/ThemedPanels.tsx`:

```tsx
export function NewPanel({ children, ...props }: ThemedPanelProps) {
  const theme = props.theme || defaultTheme;
  return (
    <Panel
      title={props.title || "New"}
      borderColor={theme.newColor}
      borderStyle="heavy"
      {...props}
    >
      {children}
    </Panel>
  );
}
```

4. Export from `src/index.ts`

### Adding a New Border Style

1. Define character set in `src/boxes/styles.ts`:

```typescript
export const NEW_STYLE = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
};
```

2. Add to BoxStyleName union type
3. Update Panel component's border style switch

### Adding a New Hook

1. Create file in `src/hooks/` following naming convention `use*.ts`
2. Export hook function with proper TypeScript types
3. Add to `src/index.ts` exports
4. Document in `API.md`

### Creating a New Preset

1. Create file in `src/presets/` (e.g., `WorkflowResponse.tsx`)
2. Compose existing components:

```tsx
export function WorkflowResponse({ steps, ...props }) {
  return (
    <>
      {steps.map((step, i) => (
        <ReasoningPanel key={i} title={`Step ${i + 1}`}>
          <Text>{step.content}</Text>
        </ReasoningPanel>
      ))}
      <ResponsePanel>{props.result}</ResponsePanel>
    </>
  );
}
```

3. Export from `src/index.ts`

## Testing Strategy

When implementing tests (Phase 3):

1. **Component Tests** - Use `ink-testing-library` to test rendering
2. **Hook Tests** - Test state management and async behavior
3. **Integration Tests** - Test complete workflows with mock streams
4. **Visual Tests** - Snapshot testing for border rendering

Example test structure:

```typescript
import { render } from 'ink-testing-library';
import { Panel } from '../components/Panel';

test('Panel renders with title', () => {
  const { lastFrame } = render(
    <Panel title="Test">Content</Panel>
  );
  expect(lastFrame()).toContain('Test');
  expect(lastFrame()).toContain('Content');
});
```

## Known Issues & Limitations

1. **Border Width Calculation** - May have slight issues on very narrow terminals (<40 columns)
2. **No Markdown Rendering** - Planned for Phase 2, currently only plain text
3. **No Table Support** - Not yet implemented
4. **Stream Error Handling** - Basic implementation, needs enhancement
5. **Performance** - Not optimized for very large outputs (>10k lines)

## Future Enhancements (Roadmap)

### Phase 2 - Enhanced Features
- [ ] Markdown rendering using marked-terminal
- [ ] JSON syntax highlighting
- [ ] Table component for structured data
- [ ] Progress bars for deterministic tasks
- [ ] Better stream error recovery
- [ ] Memory optimization for long outputs

### Phase 3 - Production Ready
- [ ] Comprehensive test suite
- [ ] Performance benchmarks
- [ ] CI/CD pipeline
- [ ] npm publication
- [ ] Documentation website
- [ ] More real-world examples (OpenAI, Anthropic, Groq, etc.)

## Code Style Guidelines

1. **TypeScript First** - Always use proper types, avoid `any`
2. **React Hooks** - Prefer functional components with hooks
3. **Composition Over Inheritance** - Build complex components from simple ones
4. **Explicit Exports** - Only export what's part of the public API
5. **Comments** - Document complex logic, not obvious code
6. **Props Spreading** - Use `...props` for flexibility but document overrides

## Integration Examples

### OpenAI Streaming

```tsx
import OpenAI from 'openai';
import { AgentResponse } from 'parlor';

const openai = new OpenAI();
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true,
});

render(
  <AgentResponse
    message="Hello"
    responseStream={stream}
    extractContent={(chunk) => chunk.choices[0]?.delta?.content || ''}
  />
);
```

### Anthropic Streaming

```tsx
import Anthropic from '@anthropic-ai/sdk';
import { SimpleResponse } from 'parlor';

const anthropic = new Anthropic();
const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 1024,
});

render(
  <SimpleResponse
    responseStream={stream}
    extractContent={(chunk) => {
      if (chunk.type === 'content_block_delta') {
        return chunk.delta.text || '';
      }
      return '';
    }}
  />
);
```

## Troubleshooting

### Build Issues

```bash
# Clear dist and rebuild
rm -rf dist
bun run build
```

### Terminal Width Issues

Check if terminal supports width detection:
```typescript
import { getTerminalWidth } from 'parlor';
console.log(getTerminalWidth()); // Should return number > 0
```

### Streaming Not Working

Verify your async iterator is properly formatted:
```typescript
// Test with simple async generator
async function* testStream() {
  yield { content: 'Hello ' };
  yield { content: 'World' };
}

// Should work with useStreamingContent
```

### Border Rendering Issues

Check terminal ANSI support:
```bash
echo -e "\e[31mRed Text\e[0m"
```

If colors don't work, terminal may not support ANSI escape codes.

## Resources

### Documentation
- [Ink Documentation](https://github.com/vadimdemedes/ink) - Core UI framework
- [Chalk Documentation](https://github.com/chalk/chalk) - Terminal styling
- [Python Rich](https://rich.readthedocs.io/) - Inspiration for design
- [Agno Framework](https://docs.agno.com) - Reference implementation

### Internal Docs
- `INSTRUCTIONS.md` - Original implementation plan and architecture
- `API.md` - Complete API reference for all exports
- `STATUS.md` - Current implementation status and next steps
- `README.md` - User-facing documentation and examples

## Contact & Support

- Project maintainer: Check package.json for author info
- Issues: Use GitHub issues for bug reports
- Discussions: For questions and feature requests

---

## Quick Reference Card

**Common Commands:**
```bash
bun install              # Install dependencies
bun run build           # Build for production
bun run dev             # Watch mode development
bun run example:agent   # Run agent example
```

**Key Files:**
- `src/index.ts` - Main entry point
- `src/components/Panel.tsx` - Core component
- `src/hooks/useStreamingContent.ts` - Main hook
- `package.json` - Dependencies and scripts

**Default Colors (Theme):**
```
message: cyan
response: blue  
reasoning: green
toolCalls: yellow
error: red
warning: yellow
```

**Border Styles:**
```
heavy: ┏━┓┃┗━┛ (default)
single: ┌─┐│└─┘
double: ╔═╗║╚═╝
rounded: ╭─╮│╰─╯
bold: ┏━┓┃┗━┛
```

---

*Last Updated: December 2024*
*Project Version: 0.1.0*
*Status: Phase 1 Complete ✅*
