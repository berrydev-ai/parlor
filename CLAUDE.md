# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Parlor is a TypeScript library for rich terminal output, optimized for AI agent responses with streaming support. Built on Ink (React for terminals), it provides bordered panels, spinners, and markdown rendering.

## Common Commands

```bash
bun run build          # Production build (dist/index.js, dist/index.cjs, dist/index.d.ts)
bun run dev            # Watch mode development
bun test               # Run tests
bun run lint           # Lint with ESLint
bun run lint:fix       # Fix lint issues
bun run typecheck      # TypeScript type checking
bun run format         # Format with Prettier

# Run examples
bun run example:simple     # Simple API (no React)
bun run example:basic      # React/Ink panels
bun run example:streaming  # Streaming demo
bun run example:agent      # Agent workflow
```

Output: `dist/index.cjs` (CJS), `dist/index.js` (ESM), `dist/index.d.cts` (CJS types), `dist/index.d.ts` (ESM types)

## Architecture

### Two APIs

Parlor provides two APIs:

1. **Simple API** (`@berrydev-ai/parlor/simple`) - Fluent builder pattern, no React required
2. **React/Ink API** (`@berrydev-ai/parlor`) - Full React components with streaming support

### Simple API Architecture

```
src/simple/
├── index.ts              # Entry point, exports parlor()
├── ParlorBuilder.ts      # Fluent API builder class
├── renderer.ts           # String-based panel builder (no Ink)
├── utils/
│   └── color.ts          # Type-safe chalk color utilities
└── templates/
    ├── header.ts         # Section dividers
    ├── dl.ts             # Description lists
    ├── list.ts           # Bullet/numbered lists
    ├── code.ts           # Syntax-highlighted code
    └── figlet.ts         # ASCII art text
```

**Key Design:** The Simple API bypasses Ink entirely, building strings directly using:
- Existing utilities: `wrapText()`, `getStringWidth()`, `renderMarkdown()`
- Existing box styles and themes
- Direct `process.stdout.write()` for `.render()`

This mirrors how Panel internally builds bordered strings, but without the React wrapper.

### React/Ink Component Hierarchy

```
Panel (base) → ThemedPanels (MessagePanel, ResponsePanel, etc.)
                    ↓
            AgentResponse / SimpleResponse (presets that compose panels)
```

- **Panel** (`src/components/Panel.tsx`): Core bordered box with title, border styles (heavy/single/double/rounded/bold), and padding
- **ThemedPanels** (`src/components/ThemedPanels.tsx`): Semantic wrappers with preset colors (MessagePanel=cyan, ResponsePanel=blue, etc.)
- **AgentResponse** (`src/presets/AgentResponse.tsx`): Complete agent layout composing multiple panels

### Streaming Architecture

The `useStreamingContent` hook (`src/hooks/useStreamingContent.ts`) consumes AsyncIterator/AsyncIterable with:
- Generic `extractContent` function to adapt any stream format (OpenAI, Anthropic, etc.)
- State tracking: `content`, `isStreaming`, `elapsed`, `error`
- Lifecycle callbacks: `onChunk`, `onComplete`, `onError`

### Key Subsystems

- **Box styles** (`src/boxes/styles.ts`): Unicode box-drawing character sets (HEAVY, SINGLE, DOUBLE, ROUNDED, BOLD)
- **Themes** (`src/themes/`): Color schemes for panel types. Default theme matches Agno's aesthetic
- **Markdown** (`src/utils/markdown.ts`): Renders markdown with syntax-highlighted code blocks via marked-terminal
- **Text utilities** (`src/utils/wrap.ts`): ANSI-aware text wrapping, terminal width detection

### Exports Pattern

All public API is exported from `src/index.ts`. Components use `.js` extensions in imports for ESM compatibility.

## Adding New Panel Types (React/Ink)

1. Add color to `Theme` interface in `src/themes/types.ts`
2. Add default value in `src/themes/default.ts`
3. Create component in `src/components/ThemedPanels.tsx` wrapping `Panel`
4. Export from `src/index.ts`

## Adding New Simple API Templates

1. Create template builder in `src/simple/templates/` (e.g., `table.ts`)
2. Export the builder function and options interface
3. Add method to `ParlorBuilder` class in `src/simple/ParlorBuilder.ts`
4. Export from `src/simple/index.ts`

Example template structure:
```ts
// src/simple/templates/mytemplate.ts
import { createColorizer } from '../utils/color.js';

export interface MyTemplateOptions {
  color?: string;
  // ... other options
}

export function buildMyTemplate(data: unknown, options: MyTemplateOptions = {}): string {
  const colorize = createColorizer(options.color ?? 'white');
  // Build and return string
  return colorize('result');
}
```

## Known Limitations

- Border width issues on terminals <40 columns
- No table component yet
- Basic stream error handling
