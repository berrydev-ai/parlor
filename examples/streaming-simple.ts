/**
 * Example: Streaming API usage
 *
 * Run with: bun run examples/streaming-simple.ts
 */

import {
  ThinkingIndicator,
  StreamingPanel,
  streamResponse,
  StreamExtractors,
  parlor,
} from '../src/simple/index.js';

// Helper to simulate delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // Header
  parlor()
    .figlet('STREAMING', { color: 'cyan' })
    .newline()
    .header('Parlor Streaming Demo', { color: 'green' })
    .newline()
    .render();

  // ============================================
  // Demo 1: ThinkingIndicator with gradient sweep
  // ============================================
  console.log('Demo 1: ThinkingIndicator with gradient sweep\n');

  const thinking = new ThinkingIndicator('Processing your request...', {
    shimmer: true,
    color: 'cyan',
  });

  thinking.start();
  await delay(4000); // Simulate async work
  thinking.stop();

  parlor().success('ThinkingIndicator demo complete!').newline().render();

  await delay(1000);

  // ============================================
  // Demo 2: StreamingPanel with word-by-word content
  // ============================================
  console.log('Demo 2: StreamingPanel with progressive content\n');

  const panel = new StreamingPanel({
    title: 'Streaming Response',
    borderStyle: 'rounded',
    borderColor: 'blue',
  });

  panel.start();

  const words =
    'This is a streaming response that appears word by word. The panel automatically redraws as content is appended, keeping the borders intact while showing progressive updates.'.split(
      ' '
    );

  for (const word of words) {
    await delay(80);
    panel.append(word + ' ');
  }

  panel.finish();

  await delay(1000);

  // ============================================
  // Demo 3: streamResponse with mock Mastra stream
  // ============================================
  console.log('\nDemo 3: streamResponse with mock stream\n');

  // Mock Mastra-style stream
  async function* mockMastraStream() {
    // Simulate reasoning first
    const reasoningParts = [
      'Analyzing ',
      'the request... ',
      'Checking ',
      'available data... ',
      'Formulating ',
      'response...',
    ];

    for (const part of reasoningParts) {
      yield { type: 'reasoning-delta', payload: { text: part } };
      await delay(100);
    }

    // Then text response
    const textParts = [
      'Based on my analysis, ',
      'here is the answer to your question. ',
      'The solution involves ',
      'several key steps:\n\n',
      '1. First, identify the problem\n',
      '2. Then, gather relevant information\n',
      '3. Finally, implement the solution\n\n',
      'This approach ensures ',
      'a comprehensive and ',
      'well-structured response.',
    ];

    for (const part of textParts) {
      yield { type: 'text-delta', payload: { text: part } };
      await delay(100);
    }
  }

  const result = await streamResponse(mockMastraStream(), {
    title: 'Agent Response',
    thinking: 'Thinking...',
    showReasoning: true,
    extractor: StreamExtractors.mastra,
  });

  console.log('\n--- Result ---');
  console.log('Text length:', result.text.length);
  console.log('Reasoning length:', result.reasoning?.length ?? 0);

  await delay(1000);

  // ============================================
  // Demo 4: Mock OpenAI stream
  // ============================================
  console.log('\n\nDemo 4: Mock OpenAI-style stream\n');

  async function* mockOpenAIStream() {
    const parts = ['Hello! ', "I'm an AI assistant. ", 'How can I help you today?'];

    for (const part of parts) {
      yield { choices: [{ delta: { content: part } }] };
      await delay(150);
    }
  }

  await streamResponse(mockOpenAIStream(), {
    title: 'OpenAI Response',
    thinking: 'Generating...',
    extractor: StreamExtractors.openai,
    borderStyle: 'double',
    borderColor: 'green',
  });

  // Final message
  parlor().newline().header('Demo Complete!', { color: 'magenta' }).newline().render();
}

main().catch(console.error);
