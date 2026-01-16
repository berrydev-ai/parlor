import { ThinkingIndicator, type ThinkingIndicatorOptions } from './ThinkingIndicator.js';
import { StreamingPanel } from './StreamingPanel.js';
import { ReasoningPanel } from './ReasoningPanel.js';
import { StreamExtractors, type StreamExtractor, type StreamChunk } from './extractors.js';

/**
 * Options for streamResponse helper
 */
export interface StreamResponseOptions {
  /** Panel title */
  title?: string;
  /** Border style */
  borderStyle?: 'heavy' | 'single' | 'double' | 'rounded' | 'bold';
  /** Border color */
  borderColor?: string;
  /** Text to show while waiting for first chunk */
  thinking?: string;
  /** Options for thinking indicator */
  thinkingOptions?: ThinkingIndicatorOptions;
  /** Show reasoning in a separate panel above response */
  showReasoning?: boolean;
  /** Custom stream extractor (default: auto) */
  extractor?: StreamExtractor;
  /** Callback for each chunk */
  onChunk?: (chunk: StreamChunk) => void;
  /** Callback when stream completes */
  onComplete?: (result: StreamResult) => void;
  /** Callback for errors */
  onError?: (error: Error) => void;
  /** Panel width */
  width?: number;
  /** Maximum panel width */
  maxWidth?: number;
  /** Padding inside panel */
  padding?: number;
}

/**
 * Result from streamResponse
 */
export interface StreamResult {
  /** Full text content */
  text: string;
  /** Full reasoning content (if any) */
  reasoning?: string;
}

/**
 * Stream a response with automatic thinking indicator and panel rendering
 *
 * @example
 * ```ts
 * // Basic usage
 * const result = await streamResponse(llmStream, {
 *   title: 'Assistant',
 *   thinking: 'Thinking...',
 * })
 *
 * // With Mastra
 * const result = await streamResponse(
 *   agent.stream(context).fullStream,
 *   {
 *     title: 'agent',
 *     thinking: 'Processing...',
 *     showReasoning: true,
 *     extractor: StreamExtractors.mastra,
 *   }
 * )
 * ```
 */
export async function streamResponse(
  stream: AsyncIterable<unknown>,
  options: StreamResponseOptions = {}
): Promise<StreamResult> {
  const extractor = options.extractor ?? StreamExtractors.auto;

  let thinkingIndicator: ThinkingIndicator | null = null;
  let reasoningPanel: ReasoningPanel | null = null;
  let responsePanel: StreamingPanel | null = null;

  let fullText = '';
  let fullReasoning = '';
  let firstContentChunk = true;
  let hasStartedResponse = false;

  // Show thinking indicator
  if (options.thinking) {
    thinkingIndicator = new ThinkingIndicator(options.thinking, {
      shimmer: true,
      ...options.thinkingOptions,
    });
    thinkingIndicator.start();
  }

  try {
    for await (const rawChunk of stream) {
      const chunk = extractor(rawChunk);

      // Skip empty chunks
      if (!chunk.text && !chunk.reasoning) {
        continue;
      }

      // Stop thinking indicator on first content
      if (firstContentChunk) {
        thinkingIndicator?.stop();
        thinkingIndicator = null;
        firstContentChunk = false;
      }

      // Handle reasoning content
      if (chunk.reasoning) {
        fullReasoning += chunk.reasoning;

        if (options.showReasoning) {
          // Create reasoning panel if needed
          if (!reasoningPanel) {
            reasoningPanel = new ReasoningPanel({
              width: options.width,
              maxWidth: options.maxWidth,
              padding: options.padding,
            });
            reasoningPanel.start();
          }
          reasoningPanel.append(chunk.reasoning);
        }
      }

      // Handle text content
      if (chunk.text) {
        fullText += chunk.text;

        // Create response panel if needed
        if (!hasStartedResponse) {
          // Finish reasoning panel before starting response
          if (reasoningPanel) {
            reasoningPanel.finish();
          }

          responsePanel = new StreamingPanel({
            title: options.title,
            borderStyle: options.borderStyle,
            borderColor: options.borderColor,
            width: options.width,
            maxWidth: options.maxWidth,
            padding: options.padding,
          });
          responsePanel.start();
          hasStartedResponse = true;
        }

        responsePanel?.append(chunk.text);
      }

      // Call chunk callback
      options.onChunk?.(chunk);
    }
  } catch (error) {
    // Clean up on error
    thinkingIndicator?.stop();
    reasoningPanel?.clear();
    responsePanel?.clear();

    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    }
    throw error;
  } finally {
    // Ensure everything is cleaned up
    thinkingIndicator?.stop();
    reasoningPanel?.finish();
    responsePanel?.finish();
  }

  const result: StreamResult = {
    text: fullText,
    reasoning: fullReasoning || undefined,
  };

  options.onComplete?.(result);
  return result;
}

/**
 * Stream response from a Mastra agent
 * Convenience wrapper that handles Mastra's stream format
 *
 * @example
 * ```ts
 * const result = await streamMastraResponse(
 *   analyticsAgent.stream(context, { maxSteps: 999 }),
 *   {
 *     title: 'agent',
 *     thinking: 'Analyzing...',
 *     showReasoning: true,
 *   }
 * )
 * ```
 */
export async function streamMastraResponse(
  mastraStream:
    | { fullStream: AsyncIterable<unknown>; text: Promise<string> }
    | AsyncIterable<unknown>,
  options: Omit<StreamResponseOptions, 'extractor'> = {}
): Promise<StreamResult> {
  // Handle both direct stream and Mastra's stream object with fullStream property
  const stream =
    'fullStream' in mastraStream
      ? mastraStream.fullStream
      : (mastraStream as AsyncIterable<unknown>);

  return streamResponse(stream, {
    ...options,
    extractor: StreamExtractors.mastra,
  });
}
