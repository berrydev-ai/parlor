#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { AgentResponse } from '../src/index.js';

/**
 * Example: Integration with OpenAI-like API
 * 
 * This shows how to use Parlor with actual LLM APIs.
 * Replace with your actual API call.
 */

interface StreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
      reasoning?: string;
    };
    finish_reason?: string;
  }>;
}

/**
 * Example OpenAI streaming integration
 */
async function callOpenAI(prompt: string): Promise<AsyncIterableIterator<StreamChunk>> {
  // This is a mock - replace with actual OpenAI call:
  // 
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [{ role: "user", content: prompt }],
  //   stream: true,
  // });
  // 
  // return response;

  // Mock implementation for demonstration
  return simulateOpenAIStream(prompt);
}

async function* simulateOpenAIStream(prompt: string): AsyncIterableIterator<StreamChunk> {
  const response = `Based on your question about "${prompt}", here's my response. This simulates how real LLM streaming works. Each word is sent as a separate chunk, allowing for real-time display of the response as it's generated.`;
  
  const words = response.split(' ');
  
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50));
    yield {
      choices: [{
        delta: {
          content: word + ' ',
        },
      }],
    };
  }
  
  yield {
    choices: [{
      finish_reason: 'stop',
    }],
  };
}

/**
 * Extract content from OpenAI stream chunk
 */
function extractOpenAIContent(chunk: StreamChunk): string {
  return chunk.choices?.[0]?.delta?.content || '';
}

/**
 * Main component
 */
function OpenAIExample() {
  const prompt = "What are the benefits of using TypeScript?";
  const stream = callOpenAI(prompt);
  
  return (
    <AgentResponse
      message={prompt}
      responseStream={stream}
      showMessage={true}
      extractContent={extractOpenAIContent}
    />
  );
}

render(<OpenAIExample />);

/**
 * Real-world usage examples:
 * 
 * // OpenAI
 * const stream = await openai.chat.completions.create({
 *   model: "gpt-4",
 *   messages: [{ role: "user", content: "Hello" }],
 *   stream: true,
 * });
 * 
 * // Anthropic Claude
 * const stream = await anthropic.messages.stream({
 *   model: "claude-3-opus-20240229",
 *   messages: [{ role: "user", content: "Hello" }],
 *   max_tokens: 1024,
 * });
 * 
 * // Then use with Parlor:
 * render(<SimpleResponse responseStream={stream} />);
 */
