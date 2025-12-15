# Parlor

[![CI](https://github.com/berrydev-ai/parlor/actions/workflows/ci.yml/badge.svg)](https://github.com/berrydev-ai/parlor/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/parlor.svg)](https://badge.fury.io/js/parlor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for rich, interactive console output - like Python's Rich library, optimized for AI agent responses with streaming support.

## Features

- **Beautiful Panels** - Bordered boxes with titles, matching Agno's aesthetic
- **Streaming Support** - Real-time updates from async iterators (perfect for LLM responses)
- **Markdown Rendering** - Code blocks with syntax highlighting and dark backgrounds
- **Fast & Lightweight** - Built on Ink (React for terminals)
- **TypeScript First** - Full type safety
- **Flexible** - Works with Bun, Node.js, and Deno
- **Themed Components** - Pre-styled panels for messages, responses, reasoning, tool calls

## Installation

```bash
bun add parlor
# or
npm install parlor
# or
pnpm add parlor
```

## Quick Start

### Basic Panel

```tsx
import { render } from 'ink';
import { MessagePanel, ResponsePanel } from 'parlor';

render(
  <>
    <MessagePanel>
      <Text>What is the meaning of life?</Text>
    </MessagePanel>

    <ResponsePanel elapsed={2.5}>
      <Text>42</Text>
    </ResponsePanel>
  </>
);
```

### Streaming Response

```tsx
import { render } from 'ink';
import { SimpleResponse } from 'parlor';

// Your LLM stream (OpenAI, Anthropic, etc.)
const stream = openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
});

render(
  <SimpleResponse
    responseStream={stream}
    extractContent={(chunk) => chunk.choices[0]?.delta?.content || ''}
  />
);
```

### Complete Agent Response

```tsx
import { render } from 'ink';
import { AgentResponse } from 'parlor';

render(
  <AgentResponse
    message="Solve the trolley problem"
    responseStream={llmStream}
    showReasoning={true}
    reasoning="Analyzing ethical frameworks..."
    toolCalls={[
      { name: 'search_web', args: { query: 'trolley problem' } }
    ]}
  />
);
```

### Markdown with Syntax Highlighting

Content passed to panels automatically renders markdown with syntax highlighting:

```tsx
import { render } from 'ink';
import { ResponsePanel } from 'parlor';

const content = `Here's a Python example:

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

And some **bold** and *italic* text.`;

render(
  <ResponsePanel>
    <Text>{content}</Text>
  </ResponsePanel>
);
```

Code blocks are rendered with:
- Dark background (VS Code-style)
- Syntax highlighting for 100+ languages
- Full-width backgrounds
- Language labels

## Components

### Core Components

- **`Panel`** - Base bordered panel component
- **`MessagePanel`** - Cyan-bordered panel for user input
- **`ResponsePanel`** - Blue-bordered panel for AI responses (with elapsed time)
- **`ReasoningPanel`** - Green-bordered panel for thinking/reasoning
- **`ToolCallsPanel`** - Yellow-bordered panel for tool execution
- **`ErrorPanel`** - Red-bordered panel for errors
- **`WarningPanel`** - Yellow-bordered panel for warnings

### Spinners

- **`ProgressSpinner`** - Custom animated progress bar
- **`DotsSpinner`** - Dots spinner animation

### Presets

- **`AgentResponse`** - Complete agent response layout with all panels
- **`SimpleResponse`** - Just the response panel with streaming

## Hooks

### `useStreamingContent`

Hook for consuming async iterators with state tracking:

```tsx
const { content, isStreaming, elapsed, error } = useStreamingContent({
  iterator: stream,
  extractContent: (chunk) => chunk.content,
  onComplete: (fullText) => console.log('Done!'),
});
```

### `useTimer`

Simple elapsed time tracker:

```tsx
const elapsed = useTimer(isActive);
```

## Customization

### Custom Themes

```tsx
import { Panel } from 'parlor';

<Panel
  title="Custom Panel"
  borderColor="magenta"
  borderStyle="double"
  padding={2}
>
  Your content here
</Panel>
```

### Border Styles

Available styles: `heavy` (default), `single`, `double`, `rounded`, `bold`

```tsx
import { Panel, HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD } from 'parlor';
```

## Examples

See the `examples/` directory for complete working examples:

- `examples/basic.tsx` - All panel types
- `examples/streaming.tsx` - Streaming response with markdown
- `examples/agent-response.tsx` - Complete agent workflow

Run examples:

```bash
bun run example:basic
bun run example:streaming
bun run example:agent
```

## API Reference

### Panel Props

```tsx
interface PanelProps {
  children: React.ReactNode;
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  borderColor?: string;
  padding?: number | [number, number];
  expand?: boolean;
  width?: number;
}
```

### AgentResponse Props

```tsx
interface AgentResponseProps<T> {
  message?: string;
  responseStream?: AsyncIterator<T> | AsyncIterable<T>;
  showMessage?: boolean;
  showReasoning?: boolean;
  reasoning?: string;
  toolCalls?: Array<{ name: string; args: Record<string, unknown> }>;
  theme?: Theme;
  extractContent?: (chunk: T) => string;
}
```

## Comparison with Python Rich

| Feature | Parlor | Python Rich |
|---------|--------|-------------|
| Panels | Yes | Yes |
| Live Updates | Yes | Yes |
| Streaming | Yes | Yes |
| Spinners | Yes | Yes |
| Markdown | Yes | Yes |
| Syntax Highlighting | Yes | Yes |
| Tables | Planned | Yes |

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run dev

# Run tests
bun test

# Lint
bun run lint

# Format
bun run format

# Type check
bun run typecheck
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests and linting (`bun test && bun run lint`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT - see [LICENSE](LICENSE) for details.

## Credits

Inspired by:
- [Python Rich](https://github.com/Textualize/rich) by Will McGugan
- [Agno](https://github.com/agno-agi/agno) - AI agent framework
- [Ink](https://github.com/vadimdemedes/ink) - React for terminals
