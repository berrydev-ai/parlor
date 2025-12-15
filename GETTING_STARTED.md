# Getting Started with Parlor

## Installation

```bash
cd /Users/eberry/Code/github.com/berrydev-ai/parlor
bun install
```

## Build the Library

```bash
bun run build
```

This will create the `dist/` directory with compiled JavaScript and TypeScript definitions.

## Run Examples

```bash
# Basic example - shows all panel types
bun run example:basic

# Streaming example - shows real-time content updates
bun run example:streaming

# Agent response - complete workflow
bun run example:agent
```

## Usage in Your Project

### 1. Import and Use Components

```tsx
import { render } from 'ink';
import { MessagePanel, ResponsePanel } from 'parlor';

render(
  <>
    <MessagePanel>
      <text>Your user message here</text>
    </MessagePanel>
    
    <ResponsePanel>
      <text>AI response here</text>
    </ResponsePanel>
  </>
);
```

### 2. Streaming Content

```tsx
import { render } from 'ink';
import { SimpleResponse } from 'parlor';

// Your async iterator (from LLM API)
async function* myStream() {
  yield { content: "Hello " };
  yield { content: "world!" };
}

render(<SimpleResponse responseStream={myStream()} />);
```

### 3. Complete Agent Response

```tsx
import { render } from 'ink';
import { AgentResponse } from 'parlor';

render(
  <AgentResponse
    message="User's question"
    responseStream={llmStream}
    showReasoning={true}
    reasoning="Thinking about the problem..."
    toolCalls={[
      { name: 'search', args: { query: 'AI' } }
    ]}
  />
);
```

## Testing Your Changes

After making changes to the source code:

1. Rebuild: `bun run build`
2. Run examples to see changes: `bun run example:basic`

## Project Structure

```
parlor/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # React hooks
│   ├── boxes/             # Border styles
│   ├── themes/            # Color themes
│   ├── utils/             # Utilities
│   ├── presets/           # Pre-built layouts
│   └── index.ts           # Main exports
├── examples/              # Usage examples
├── dist/                  # Built output (generated)
└── package.json
```

## Next Steps

1. **Try the examples** - Run each example to see what's possible
2. **Modify examples** - Change colors, borders, content to experiment
3. **Build something** - Use Parlor in your AI agent project
4. **Add features** - Markdown support, tables, etc. (see STATUS.md)

## Integration Examples

### With OpenAI

```tsx
const stream = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello" }],
  stream: true,
});

render(
  <SimpleResponse 
    responseStream={stream}
    extractContent={(chunk) => chunk.choices[0]?.delta?.content || ''}
  />
);
```

### With Anthropic Claude

```tsx
const stream = await anthropic.messages.stream({
  model: "claude-3-opus-20240229",
  messages: [{ role: "user", content: "Hello" }],
  max_tokens: 1024,
});

render(
  <SimpleResponse 
    responseStream={stream}
    extractContent={(chunk) => chunk.delta?.text || ''}
  />
);
```

## Troubleshooting

### Issue: Module not found errors

**Solution**: Make sure you've run `bun install` and `bun run build`

### Issue: Borders look wrong

**Solution**: Your terminal might not support Unicode box drawing. Try a different terminal (e.g., iTerm2, Windows Terminal)

### Issue: Streaming not working

**Solution**: Check that your async iterator is yielding objects with a `content` property, or use the `extractContent` prop to specify how to extract content from chunks

## Getting Help

- Check the examples in `examples/`
- Read the API documentation in `README.md`
- Look at the source code - it's well commented!
