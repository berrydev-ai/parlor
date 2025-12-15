#!/usr/bin/env node
import React from 'react';
import { render, Text } from 'ink';
import { MessagePanel, ResponsePanel, ReasoningPanel, ToolCallsPanel } from '../src/index.js';

/**
 * Basic example showing all panel types
 */
function BasicExample() {
  return (
    <>
      <MessagePanel>
        <Text>Give me steps to write a python script for fibonacci series</Text>
      </MessagePanel>

      <ReasoningPanel elapsed={2.3}>
        <Text>Analyzing the ethical frameworks...</Text>
      </ReasoningPanel>

      <ToolCallsPanel>
        <Text>• calculate_fibonacci(n=10)</Text>
        <Text>• format_output(data=[0, 1, 1, 2, 3, 5, 8, 13, 21, 34])</Text>
      </ToolCallsPanel>

      <ResponsePanel elapsed={5.1}>
        <Text>To create a Python script that generates the Fibonacci series, follow these steps:</Text>
        <Text> </Text>
        <Text>1. Understand the Fibonacci Series</Text>
        <Text>2. Define the Problem</Text>
        <Text>3. Set Up Your Development Environment</Text>
        <Text>4. Write the Python Script</Text>
      </ResponsePanel>
    </>
  );
}

// Run the app with proper exit handling
const app = render(<BasicExample />);

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  app.unmount();
  process.exit(0);
});

// Wait for the app to finish
app.waitUntilExit().then(() => {
  process.exit(0);
});
