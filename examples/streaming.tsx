#!/usr/bin/env node
import React, { useMemo } from 'react';
import { render } from 'ink';
import { SimpleResponse } from '../src/index.js';

/**
 * Simulate an LLM streaming response with markdown content
 */
function createSimulatedStream() {
  const text = `To create a Python script that generates the Fibonacci series, follow these steps:

1. **Understand the Fibonacci Series**: The Fibonacci series is a sequence where each number is the sum of the two preceding ones.

2. **Implementation**: Here's a simple recursive solution:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 numbers
for i in range(10):
    print(fibonacci(i))
\`\`\`

This recursive approach is elegant but has O(2^n) time complexity. For better performance, consider using memoization or an iterative approach.`;

  const words = text.split(' ');
  let index = 0;

  return {
    async next(): Promise<IteratorResult<{ content: string }>> {
      if (index >= words.length) {
        return { done: true, value: undefined };
      }
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
      const word = words[index++];
      return { done: false, value: { content: word + ' ' } };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

/**
 * Streaming example
 */
function StreamingExample() {
  // Create stream once on mount using useMemo
  const stream = useMemo(() => createSimulatedStream(), []);

  return <SimpleResponse responseStream={stream} title="Response" />;
}

// Run the app with proper exit handling
const app = render(<StreamingExample />);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  app.unmount();
  process.exit(0);
});

// Wait for the app to finish
app.waitUntilExit().then(() => {
  process.exit(0);
});
