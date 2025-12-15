# TypeScript Rich-like Console Rendering Library Plan

## Overview

A TypeScript library for rendering rich, interactive console output similar to Python's Rich library, optimized for LLM agent responses with streaming support.

**Target Runtimes:** Bun, Deno, Node.js (modern runtime compatible)
**Architecture:** React-like declarative components using Ink
**Key Feature:** Real-time streaming from async iterators (LLM responses)

---

## Analysis of Python Rich Implementation (from agno)

### Core Components Used

| Rich Component | Purpose | TypeScript Equivalent |
|---------------|---------|----------------------|
| `Panel` | Bordered boxes with titles | Custom Ink `<Panel>` component |
| `Live` | Real-time terminal updates | Ink's built-in re-rendering |
| `Status` | Animated spinners | `ink-spinner` package |
| `Text` | Styled text with colors | `chalk` + Ink `<Text>` |
| `Markdown` | Render markdown | `ink-markdown` or `marked-terminal` |
| `JSON` | Syntax-highlighted JSON | `ink-syntax-highlight` or custom |
| `Group` | Combine multiple renderables | Ink's fragment/array children |
| `Console` | Terminal output management | Ink's `render()` function |

### Panel Configuration from agno

```python
Panel(
    content,
    title=title,
    title_align="left",
    border_style="blue",  # Color name
    box=HEAVY,            # Box drawing style: ┏━┓┃┗━┛
    expand=True,          # Full terminal width
    padding=(1, 1)        # Vertical, Horizontal padding
)
```

### Color Scheme (Semantic)

| Panel Type | Border Color | Use Case |
|------------|-------------|----------|
| Message | `cyan` | User input display |
| Response | `blue` | AI response content |
| Reasoning | `green` | Thinking/reasoning steps |
| Tool Calls | `yellow` | Function/tool execution |
| Citations | `green` | Source references |
| Error | `red` | Error messages |
| Team | `magenta` | Multi-agent responses |

---

## Recommended Tech Stack

### Core Dependencies

```json
{
  "dependencies": {
    "ink": "^4.4.1",
    "ink-spinner": "^5.0.0",
    "react": "^18.2.0",
    "chalk": "^5.3.0",
    "cli-boxes": "^3.0.0",
    "marked": "^11.0.0",
    "marked-terminal": "^6.2.0",
    "strip-ansi": "^7.1.0",
    "wrap-ansi": "^9.0.0",
    "string-width": "^7.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0"
  }
}
```

### Why Ink?

1. **Declarative**: React paradigm makes complex UIs manageable
2. **Live Updates**: Built-in efficient re-rendering (like Rich Live)
3. **Cross-runtime**: Works in Node.js, Bun, Deno
4. **Ecosystem**: Rich ecosystem of components (spinners, tables, etc.)
5. **Flexbox Layout**: CSS-like layout for terminal

---

## Library Architecture

### Directory Structure

```
src/
├── index.ts                 # Main exports
├── components/
│   ├── Panel.tsx            # Bordered panel component
│   ├── MessagePanel.tsx     # Pre-styled message input panel
│   ├── ResponsePanel.tsx    # Pre-styled AI response panel
│   ├── ReasoningPanel.tsx   # Thinking/reasoning display
│   ├── ToolCallsPanel.tsx   # Tool execution display
│   ├── StatusSpinner.tsx    # Animated status indicator
│   ├── Markdown.tsx         # Markdown renderer
│   ├── JsonHighlight.tsx    # Syntax-highlighted JSON
│   └── Text.tsx             # Styled text wrapper
├── hooks/
│   ├── useStreamingContent.ts   # Handle async iterators
│   ├── useTimer.ts              # Elapsed time tracking
│   └── usePanelManager.ts       # Manage panel collection
├── boxes/
│   └── styles.ts            # Box drawing character sets
├── themes/
│   ├── default.ts           # Default color scheme
│   └── types.ts             # Theme type definitions
├── utils/
│   ├── markdown.ts          # Markdown processing
│   ├── wrap.ts              # Text wrapping utilities
│   └── escape.ts            # Tag escaping (like agno)
└── presets/
    └── AgentResponse.tsx    # Full agent response layout
```

---

## Component Specifications

### 1. Panel Component (Core)

```tsx
import React from 'react';
import { Box, Text } from 'ink';

interface PanelProps {
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'heavy' | 'rounded' | 'single' | 'double';
  borderColor?: string;
  padding?: number | [number, number];
  expand?: boolean;
  children: React.ReactNode;
}

// Box drawing character sets
const BOX_STYLES = {
  heavy: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
  rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
};
```

**Implementation Notes:**
- Use Ink's `<Box>` for layout with `flexDirection="column"`
- Calculate terminal width with `process.stdout.columns`
- Handle title rendering within top border
- Support both number and tuple padding (vertical, horizontal)

### 2. Streaming Content Hook

```tsx
import { useState, useEffect } from 'react';

interface StreamingOptions<T> {
  iterator: AsyncIterator<T>;
  onChunk?: (chunk: T) => void;
  onComplete?: (fullContent: string) => void;
}

function useStreamingContent<T extends { content?: string }>(
  options: StreamingOptions<T>
): {
  content: string;
  isStreaming: boolean;
  elapsed: number;
} {
  // Implementation handles:
  // 1. Consuming async iterator
  // 2. Accumulating content
  // 3. Tracking elapsed time
  // 4. Managing streaming state
}
```

### 3. Agent Response Preset

```tsx
import React from 'react';
import { render } from 'ink';

interface AgentResponseProps {
  message: string;
  responseStream: AsyncIterator<ResponseChunk>;
  showMessage?: boolean;
  showReasoning?: boolean;
  markdown?: boolean;
  theme?: Theme;
}

function AgentResponse({
  message,
  responseStream,
  showMessage = true,
  showReasoning = true,
  markdown = true,
  theme = defaultTheme,
}: AgentResponseProps) {
  const { content, reasoning, toolCalls, isStreaming, elapsed } =
    useAgentStream(responseStream);

  return (
    <>
      <StatusSpinner
        text="Thinking..."
        isActive={isStreaming}
      />

      {showMessage && (
        <Panel
          title="Message"
          borderColor={theme.message}
        >
          <Text color="green">{message}</Text>
        </Panel>
      )}

      {showReasoning && reasoning && (
        <Panel
          title={`Thinking (${elapsed.toFixed(1)}s)`}
          borderColor={theme.reasoning}
        >
          <Text>{reasoning}</Text>
        </Panel>
      )}

      {toolCalls.length > 0 && (
        <Panel
          title="Tool Calls"
          borderColor={theme.toolCalls}
        >
          {toolCalls.map((tc, i) => (
            <Text key={i}>• {tc.name}({tc.args})</Text>
          ))}
        </Panel>
      )}

      <Panel
        title={`Response (${elapsed.toFixed(1)}s)`}
        borderColor={theme.response}
      >
        {markdown ? (
          <Markdown>{content}</Markdown>
        ) : (
          <Text>{content}</Text>
        )}
      </Panel>
    </>
  );
}
```

---

## Implementation Plan

### Phase 1: Core Foundation

1. **Project Setup**
   - Initialize TypeScript project with Bun
   - Configure for Bun/Deno/Node.js compatibility
   - Set up Ink and React dependencies
   - Configure build for ESM and CJS output

2. **Box Drawing System**
   - Implement box character sets (HEAVY, ROUNDED, etc.)
   - Create border rendering functions
   - Handle terminal width detection
   - Implement text wrapping within borders

3. **Basic Panel Component**
   - Render bordered boxes
   - Support titles with alignment
   - Handle padding configuration
   - Implement color theming

### Phase 2: Text & Styling

4. **Text Styling System**
   - Wrap chalk for color/style application
   - Support markup syntax like `[bold]text[/bold]`
   - Implement semantic styles (dim, bold, italic)
   - Create Text component with style props

5. **Markdown Rendering**
   - Integrate marked + marked-terminal
   - Handle code blocks with syntax highlighting
   - Support lists, headings, emphasis
   - Escape special tags (like agno's `<think>` handling)

6. **JSON Highlighting**
   - Syntax coloring for JSON
   - Proper indentation
   - Handle large JSON with truncation

### Phase 3: Live Updates & Animation

7. **Streaming Support**
   - Create `useStreamingContent` hook
   - Handle async iterator consumption
   - Implement content accumulation
   - Add elapsed time tracking

8. **Status/Spinner Component**
   - Integrate ink-spinner
   - Match Rich's "aesthetic" spinner style
   - Support custom spinner text
   - Handle show/hide transitions

9. **Panel Manager**
   - Manage collection of panels
   - Handle panel ordering
   - Support dynamic panel addition/removal
   - Implement Group-like functionality

### Phase 4: Presets & Polish

10. **Agent Response Preset**
    - Combine all components
    - Match agno's output format exactly
    - Support all display options
    - Handle edge cases (empty content, errors)

11. **Theme System**
    - Define theme interface
    - Create default theme matching agno
    - Support custom themes
    - Add dark/light mode variants

12. **API Refinement**
    - Simplify public API
    - Add convenience functions
    - Write comprehensive TypeScript types
    - Create JSDoc documentation

---

## API Design

### Simple Usage

```typescript
import { renderAgentResponse } from 'rich-ts';

// Stream from an LLM
const stream = openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
});

await renderAgentResponse({
  message: 'Hello!',
  stream: stream,
  markdown: true,
});
```

### Component Usage

```tsx
import React from 'react';
import { render } from 'ink';
import { Panel, StatusSpinner, Markdown } from 'rich-ts';

function MyApp() {
  return (
    <>
      <StatusSpinner text="Loading..." isActive={true} />
      <Panel title="Output" borderColor="blue">
        <Markdown>
          # Hello World
          This is **markdown** content.
        </Markdown>
      </Panel>
    </>
  );
}

render(<MyApp />);
```

### Imperative API (for non-React users)

```typescript
import { createLiveDisplay, Panel } from 'rich-ts';

const display = createLiveDisplay();

display.update([
  Panel({ title: 'Message', borderColor: 'cyan', content: 'Hello' }),
  Panel({ title: 'Response', borderColor: 'blue', content: 'World' }),
]);

// Later...
display.stop();
```

---

## Key Implementation Details

### Terminal Width Handling

```typescript
function getTerminalWidth(): number {
  // Works in Node.js, Bun, Deno
  return process.stdout.columns || 80;
}

function wrapTextToWidth(text: string, width: number): string[] {
  // Use wrap-ansi for ANSI-aware wrapping
  return wrapAnsi(text, width, { hard: true }).split('\n');
}
```

### Border Rendering

```typescript
function renderBorder(
  content: string[],
  width: number,
  box: BoxStyle,
  title?: string,
  borderColor?: string
): string[] {
  const colorize = borderColor ? chalk[borderColor] : (s: string) => s;
  const innerWidth = width - 2; // Account for left/right borders

  // Top border with title
  let topBorder = box.tl + box.h.repeat(innerWidth) + box.tr;
  if (title) {
    const titleStr = ` ${title} `;
    const titlePos = 2; // Left aligned after corner
    topBorder =
      box.tl +
      box.h +
      titleStr +
      box.h.repeat(innerWidth - titleStr.length - 1) +
      box.tr;
  }

  const lines = [colorize(topBorder)];

  // Content lines
  for (const line of content) {
    const paddedLine = line.padEnd(innerWidth);
    lines.push(colorize(box.v) + paddedLine + colorize(box.v));
  }

  // Bottom border
  lines.push(colorize(box.bl + box.h.repeat(innerWidth) + box.br));

  return lines;
}
```

### Async Iterator Handling

```typescript
async function* consumeStream<T>(
  stream: AsyncIterable<T>,
  transform: (chunk: T) => string
): AsyncGenerator<string> {
  for await (const chunk of stream) {
    yield transform(chunk);
  }
}

// Usage with OpenAI-style streams
const contentStream = consumeStream(
  openaiStream,
  (chunk) => chunk.choices[0]?.delta?.content || ''
);
```

---

## Testing Strategy

1. **Unit Tests**
   - Box drawing character rendering
   - Text wrapping utilities
   - Markdown processing
   - Theme application

2. **Visual Tests**
   - Snapshot testing with ink-testing-library
   - Visual regression with terminal screenshots
   - Cross-runtime compatibility tests

3. **Integration Tests**
   - Full agent response rendering
   - Streaming content updates
   - Multiple panel management

---

## Compatibility Considerations

### Bun/Deno Support

```typescript
// Use cross-runtime terminal detection
const getTerminalSize = () => {
  if (typeof Deno !== 'undefined') {
    return Deno.consoleSize();
  }
  return {
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  };
};
```

### ESM/CJS Dual Package

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

---

## Example Output (Target)

```
┏━ Message ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃ Solve the trolley problem.                                                   ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┏━ Thinking (2.3s) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃ Analyzing the ethical frameworks...                                          ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┏━ Response (5.1s) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃ The trolley problem is a classic ethical dilemma...                          ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Success Criteria

1. **Visual Parity**: Output matches Python Rich/agno aesthetics
2. **Streaming**: Real-time updates from async iterators work smoothly
3. **Cross-Runtime**: Works in Bun, Deno, and Node.js
4. **Type Safety**: Full TypeScript types with good DX
5. **Performance**: No flickering, efficient re-renders
6. **Simplicity**: Simple API for common use cases, extensible for advanced

---

## Next Steps

1. Create the project with `bun init`
2. Implement the core `Panel` component
3. Add streaming support with hooks
4. Build the `AgentResponse` preset
5. Test with real LLM streams
6. Publish to npm/jsr
