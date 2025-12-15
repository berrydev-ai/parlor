# API Reference

## Components

### Panel

Base component for bordered boxes.

```tsx
<Panel
  title="Panel Title"
  titleAlign="left" | "center" | "right"
  borderStyle="heavy" | "single" | "double" | "rounded" | "bold"
  borderColor="blue" | "cyan" | "green" | "yellow" | "red" | "magenta"
  padding={1} | [1, 2]  // [vertical, horizontal]
  expand={true}
  width={80}
>
  Content
</Panel>
```

### Themed Panels

Pre-styled panels with semantic colors:

- `MessagePanel` - Cyan border, for user messages
- `ResponsePanel` - Blue border, for AI responses
- `ReasoningPanel` - Green border, for thinking/reasoning
- `ToolCallsPanel` - Yellow border, for tool execution
- `ErrorPanel` - Red border, for errors
- `WarningPanel` - Yellow border, for warnings

```tsx
<ResponsePanel elapsed={2.5}>
  Content
</ResponsePanel>
```

### Spinners

#### ProgressSpinner

Custom animated progress indicator.

```tsx
<ProgressSpinner
  text="Thinking..."
  isActive={true}
  color="cyan"
  frames={['▰▱▱', '▰▰▱', '▰▰▰']}
  interval={80}
/>
```

#### DotsSpinner

Dots animation spinner.

```tsx
<DotsSpinner
  text="Loading..."
  isActive={true}
  color="cyan"
/>
```

### Presets

#### AgentResponse

Complete agent response layout.

```tsx
<AgentResponse
  message="User's question"
  responseStream={asyncIterator}
  showMessage={true}
  showReasoning={true}
  reasoning="Thinking..."
  toolCalls={[{ name: 'search', args: { query: 'AI' } }]}
  theme={customTheme}
  extractContent={(chunk) => chunk.content}
/>
```

#### SimpleResponse

Just the response panel with streaming.

```tsx
<SimpleResponse
  responseStream={asyncIterator}
  title="Response"
  extractContent={(chunk) => chunk.content}
/>
```

## Hooks

### useStreamingContent

Consume async iterators with state tracking.

```tsx
const {
  content,      // string - accumulated content
  isStreaming,  // boolean - currently streaming
  elapsed,      // number - seconds elapsed
  error,        // Error | null - error if any
} = useStreamingContent({
  iterator: asyncIterator,
  onChunk: (chunk) => console.log(chunk),
  onComplete: (fullText) => console.log('Done!'),
  onError: (err) => console.error(err),
  extractContent: (chunk) => chunk.content,
});
```

### useTimer

Track elapsed time.

```tsx
const elapsed = useTimer(isActive);
// Returns: number (seconds)
```

## Box Styles

Border style constants:

```tsx
import { HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD } from 'parlor';

// Use with Panel component
<Panel borderStyle="heavy">...</Panel>
```

## Themes

Default theme colors:

```tsx
const theme = {
  message: 'cyan',
  response: 'blue',
  reasoning: 'green',
  toolCalls: 'yellow',
  citations: 'green',
  error: 'red',
  team: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
};
```

Get theme by name:

```tsx
import { getTheme } from 'parlor';

const theme = getTheme('dark'); // 'default' | 'agno' | 'dark' | 'light'
```

## Utilities

### Text Wrapping

```tsx
import { 
  getTerminalWidth,
  wrapText,
  getStringWidth,
  padString,
  truncateString,
} from 'parlor';

const width = getTerminalWidth(); // number
const lines = wrapText(text, 80);  // string[]
const width = getStringWidth('hello'); // number (ignoring ANSI)
const padded = padString('hello', 10, ' '); // 'hello     '
const short = truncateString('hello world', 8); // 'hello w…'
```

### Tag Escaping

```tsx
import {
  escapeSpecialTags,
  stripTags,
  extractTagContent,
} from 'parlor';

const escaped = escapeSpecialTags('<think>content</think>');
const stripped = stripTags('<tag>content</tag>'); // 'content'
const content = extractTagContent(text, 'think'); // string | null
```

## Type Definitions

### StreamingOptions<T>

```tsx
interface StreamingOptions<T> {
  iterator: AsyncIterator<T> | AsyncIterable<T>;
  onChunk?: (chunk: T) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
  extractContent?: (chunk: T) => string;
}
```

### StreamingState

```tsx
interface StreamingState {
  content: string;
  isStreaming: boolean;
  elapsed: number;
  error: Error | null;
}
```

### Theme

```tsx
interface Theme {
  message: string;
  response: string;
  reasoning: string;
  toolCalls: string;
  citations: string;
  error: string;
  team: string;
  warning: string;
  info: string;
  success: string;
}
```

### BoxStyle

```tsx
interface BoxStyle {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
}
```

## Re-exported from Ink

For convenience, Parlor re-exports commonly used Ink components:

```tsx
import { render, Box, Text, Spacer, Static, Newline } from 'parlor';
```
