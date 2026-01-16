# Parlor

[![CI](https://github.com/berrydev-ai/parlor/actions/workflows/ci.yml/badge.svg)](https://github.com/berrydev-ai/parlor/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@berrydev-ai/parlor.svg)](https://www.npmjs.com/package/@berrydev-ai/parlor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for rich, interactive console output - like Python's Rich library, optimized for AI agent responses with streaming support.

## Features

- **Simple API** - Fluent `console.log`-style interface for quick output (no React required)
- **Beautiful Panels** - Bordered boxes with titles, matching Agno's aesthetic
- **Streaming Support** - Real-time updates from async iterators (perfect for LLM responses)
- **Markdown Rendering** - Code blocks with syntax highlighting and dark backgrounds
- **ASCII Art** - Figlet integration for eye-catching headers
- **Fast & Lightweight** - Built on Ink (React for terminals)
- **TypeScript First** - Full type safety
- **Flexible** - Works with Bun, Node.js, and Deno
- **Themed Components** - Pre-styled panels for messages, responses, reasoning, tool calls

## Installation

```bash
bun add @berrydev-ai/parlor
# or
npm install @berrydev-ai/parlor
# or
pnpm add @berrydev-ai/parlor
```

## Quick Start

### Simple API (Recommended for Basic Use)

For simple console output without React/Ink boilerplate, use the fluent Simple API:

```ts
import { parlor } from '@berrydev-ai/parlor/simple';

parlor()
  .header('My Application')
  .message('Processing your request...')
  .response('Here is the result!')
  .dl({ Status: 'Success', Duration: '2.3s' })
  .render();
```

See the [Simple API](#simple-api) section below for full documentation.

### Basic Panel (React/Ink)

```tsx
import { render } from 'ink';
import { MessagePanel, ResponsePanel } from '@berrydev-ai/parlor';

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
import { SimpleResponse } from '@berrydev-ai/parlor';

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
import { AgentResponse } from '@berrydev-ai/parlor';

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
import { ResponsePanel } from '@berrydev-ai/parlor';

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

## Simple API

The Simple API provides a `console.log`-style interface with a fluent builder pattern. It's perfect for CLI tools, scripts, and applications that don't need React/Ink's full rendering capabilities.

### Installation

The Simple API is included in the main package:

```ts
import { parlor } from '@berrydev-ai/parlor/simple';
```

### Basic Usage

```ts
// Create output and render to stdout
parlor()
  .header('Status Report')
  .message('User query received')
  .response('Processing complete!')
  .render();

// Or capture as a string
const output = parlor()
  .success('Task completed!')
  .toString();

console.log(output);
```

### Figlet ASCII Art

Create eye-catching ASCII art headers:

```ts
parlor()
  .figlet('PARLOR', { color: 'cyan', font: 'Standard' })
  .newline()
  .render();
```

Output:
```
  ____   _    ____  _     ___  ____
 |  _ \ / \  |  _ \| |   / _ \|  _ \
 | |_) / _ \ | |_) | |  | | | | |_) |
 |  __/ ___ \|  _ <| |__| |_| |  _ <
 |_| /_/   \_\_| \_\_____\___/|_| \_\
```

### Headers

Section dividers with customizable styles:

```ts
parlor()
  .header('Section Title', { color: 'green', align: 'center' })
  .render();
```

Output: `══════════════════ Section Title ══════════════════`

### Themed Panels

Pre-styled panels for different message types:

```ts
parlor()
  .message('User input')      // Cyan border
  .response('AI response')    // Blue border
  .error('Error occurred')    // Red border
  .warn('Warning message')    // Yellow border
  .success('Task complete')   // Green border
  .info('Information')        // Blue border
  .render();
```

### Custom Panels

Full control over panel styling:

```ts
parlor()
  .panel('Custom content', {
    title: 'My Panel',
    borderColor: 'magenta',
    borderStyle: 'double',
    padding: 2,
  })
  .render();
```

### Description Lists

Key-value pair formatting:

```ts
parlor()
  .dl({
    Name: 'Parlor',
    Version: '0.2.0',
    Author: 'Berry Dev AI',
    License: 'MIT',
  })
  .render();
```

Output:
```
Name     Parlor
Version  0.2.0
Author   Berry Dev AI
License  MIT
```

### Lists

Bullet and numbered lists:

```ts
// Bullet list
parlor()
  .list(['First item', 'Second item', 'Third item'])
  .render();

// Numbered list
parlor()
  .numberedList(['Step one', 'Step two', 'Step three'])
  .render();
```

### Code Blocks

Syntax-highlighted code with dark background:

```ts
parlor()
  .code(`function hello(name: string) {
  return \`Hello, \${name}!\`;
}`, 'typescript')
  .render();
```

### Chaining and Composition

All methods return the builder for chaining:

```ts
parlor()
  .figlet('MY APP', { color: 'cyan' })
  .newline()
  .header('Configuration')
  .dl({ Environment: 'production', Debug: false })
  .newline()
  .header('Status')
  .success('All systems operational')
  .newline()
  .header('Recent Activity')
  .list(['User logged in', 'Data synced', 'Report generated'])
  .render();
```

### Simple API Reference

#### Builder Methods

| Method | Description |
|--------|-------------|
| `.figlet(text, options?)` | ASCII art text |
| `.header(title, options?)` | Section divider |
| `.message(content, options?)` | Cyan panel (user input) |
| `.response(content, options?)` | Blue panel (AI response) |
| `.error(content, options?)` | Red panel (errors) |
| `.warn(content, options?)` | Yellow panel (warnings) |
| `.success(content, options?)` | Green panel (success) |
| `.info(content, options?)` | Blue panel (info) |
| `.panel(content, options?)` | Custom styled panel |
| `.dl(data, options?)` | Description list |
| `.list(items, options?)` | Bullet list |
| `.numberedList(items, options?)` | Numbered list |
| `.code(content, language?, options?)` | Code block |
| `.text(content)` | Raw text |
| `.newline()` | Empty line |
| `.clear()` | Clear all segments |

#### Output Methods

| Method | Description |
|--------|-------------|
| `.render()` | Write to stdout |
| `.toString()` | Return as string |

#### Figlet Options

```ts
interface FigletOptions {
  font?: string;        // Figlet font name (default: 'Standard')
  color?: string;       // Text color
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing';
  verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing';
}
```

#### Header Options

```ts
interface HeaderOptions {
  width?: number;       // Width (default: terminal width)
  color?: string;       // Color (default: 'white')
  style?: BoxStyle;     // Border style
  align?: 'left' | 'center' | 'right';  // Title alignment
}
```

#### Panel Options

```ts
interface PanelOptions {
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  borderColor?: string;
  width?: number;
  maxWidth?: number;
  padding?: number;
  markdown?: boolean;   // Auto-render markdown (default: auto-detect)
}
```

## Components (React/Ink)

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
import { Panel } from '@berrydev-ai/parlor';

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
import { Panel, HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD } from '@berrydev-ai/parlor';
```

## Examples

See the `examples/` directory for complete working examples:

- `examples/simple.ts` - Simple API with all features (no React required)
- `examples/basic.tsx` - All panel types (React/Ink)
- `examples/streaming.tsx` - Streaming response with markdown
- `examples/agent-response.tsx` - Complete agent workflow

Run examples:

```bash
bun run example:simple    # Simple API demo
bun run example:basic     # React/Ink panels
bun run example:streaming # Streaming demo
bun run example:agent     # Agent workflow
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
