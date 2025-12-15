import React from 'react';
import { Box, Text } from 'ink';
import {
  MessagePanel,
  ResponsePanel,
  ReasoningPanel,
  ToolCallsPanel,
} from '../components/ThemedPanels.js';
import { ProgressSpinner } from '../components/Spinner.js';
import { useStreamingContent } from '../hooks/useStreamingContent.js';
import type { Theme } from '../themes/default.js';

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface AgentResponseProps<T = unknown> {
  message?: string;
  responseStream?: AsyncIterator<T> | AsyncIterable<T>;
  showMessage?: boolean;
  showReasoning?: boolean;
  reasoning?: string;
  toolCalls?: ToolCall[];
  theme?: Theme;
  extractContent?: (chunk: T) => string;
}

// Default extract function for streaming content
const defaultExtractContent = <T,>(chunk: T): string => {
  if (chunk && typeof chunk === 'object' && 'content' in chunk) {
    return String((chunk as { content: unknown }).content || '');
  }
  return String(chunk || '');
};

/**
 * Complete Agent Response layout
 * Matches Agno's output format
 */
export function AgentResponse<T = unknown>({
  message,
  responseStream,
  showMessage = true,
  showReasoning = false,
  reasoning,
  toolCalls = [],
  extractContent = defaultExtractContent,
}: AgentResponseProps<T>) {
  // Create a dummy iterator for the hook when no stream is provided
  // This ensures the hook is always called (React rules of hooks)
  const dummyIterator: AsyncIterator<T> = {
    next: async () => ({ done: true, value: undefined as unknown as T }),
  };

  const { content, isStreaming, elapsed } = useStreamingContent({
    iterator: responseStream || dummyIterator,
    extractContent,
  });

  // If no stream was provided, don't show streaming content
  const hasStream = !!responseStream;
  const displayContent = hasStream ? content : '';
  const displayIsStreaming = hasStream ? isStreaming : false;
  const displayElapsed = hasStream ? elapsed : 0;

  return (
    <Box flexDirection="column">
      {/* Thinking spinner */}
      {displayIsStreaming && <ProgressSpinner text="Thinking..." isActive={displayIsStreaming} />}
      {/* Message panel */}
      {showMessage && message && (
        <MessagePanel>
          <Text color="white">{message}</Text>
        </MessagePanel>
      )}
      {/* Reasoning panel */}
      {showReasoning && reasoning && (
        <ReasoningPanel elapsed={displayElapsed}>
          <Text color="white">{reasoning}</Text>
        </ReasoningPanel>
      )}
      {/* Tool calls panel */}
      {toolCalls.length > 0 && (
        <ToolCallsPanel>
          {toolCalls.map((tc, i) => (
            <Text key={i} color="white">
              • {tc.name}({JSON.stringify(tc.args)})
            </Text>
          ))}
        </ToolCallsPanel>
      )}
      {/* Response panel */}
      {displayContent && (
        <ResponsePanel elapsed={displayElapsed}>
          <Text color="white">{displayContent}</Text>
        </ResponsePanel>
      )}
    </Box>
  );
}

/**
 * Simple response renderer - just shows the response panel
 */
export function SimpleResponse<T = unknown>({
  responseStream,
  title = 'Response',
  extractContent,
}: {
  responseStream: AsyncIterator<T> | AsyncIterable<T>;
  title?: string;
  extractContent?: (chunk: T) => string;
}) {
  const { content, isStreaming, elapsed } = useStreamingContent({
    iterator: responseStream,
    extractContent,
  });

  return (
    <Box flexDirection="column">
      {isStreaming && <ProgressSpinner text="Loading..." isActive={isStreaming} />}
      <ResponsePanel title={title} elapsed={elapsed}>
        <Text color="white">{content}</Text>
      </ResponsePanel>
    </Box>
  );
}
