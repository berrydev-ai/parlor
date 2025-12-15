import { useState, useEffect, useRef } from 'react';

export interface StreamingOptions<T> {
  iterator: AsyncIterator<T> | AsyncIterable<T>;
  onChunk?: (chunk: T) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
  extractContent?: (chunk: T) => string;
}

export interface StreamingState {
  content: string;
  isStreaming: boolean;
  elapsed: number;
  error: Error | null;
}

/**
 * Hook for consuming async iterators and tracking streaming state
 * Perfect for LLM response streaming
 */
// Default extract function for streaming content
const defaultExtractContent = <T>(chunk: T): string => {
  if (chunk && typeof chunk === 'object' && 'content' in chunk) {
    return String((chunk as { content: unknown }).content || '');
  }
  return String(chunk || '');
};

export function useStreamingContent<T = unknown>({
  iterator,
  onChunk,
  onComplete,
  onError,
  extractContent = defaultExtractContent,
}: StreamingOptions<T>): StreamingState {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to avoid re-triggering the effect on every render
  const iteratorRef = useRef(iterator);
  const callbacksRef = useRef({ onChunk, onComplete, onError, extractContent });
  const hasStartedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Update callbacks ref on each render (but don't trigger effect)
  callbacksRef.current = { onChunk, onComplete, onError, extractContent };

  useEffect(() => {
    // Only start streaming once
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let isCancelled = false;
    const startTime = startTimeRef.current;

    const consumeStream = async () => {
      try {
        // Handle both AsyncIterator and AsyncIterable
        const iter =
          Symbol.asyncIterator in iteratorRef.current
            ? (iteratorRef.current as AsyncIterable<T>)[Symbol.asyncIterator]()
            : (iteratorRef.current as AsyncIterator<T>);

        let fullContent = '';

        while (!isCancelled) {
          const { value, done } = await iter.next();

          if (done || isCancelled) break;

          const chunkContent = callbacksRef.current.extractContent(value);
          fullContent += chunkContent;

          if (!isCancelled) {
            setContent(fullContent);
            setElapsed((Date.now() - startTime) / 1000);

            if (callbacksRef.current.onChunk) {
              callbacksRef.current.onChunk(value);
            }
          }
        }

        if (!isCancelled) {
          setIsStreaming(false);
          setElapsed((Date.now() - startTime) / 1000);

          if (callbacksRef.current.onComplete) {
            callbacksRef.current.onComplete(fullContent);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setIsStreaming(false);

          if (callbacksRef.current.onError) {
            callbacksRef.current.onError(error);
          }
        }
      }
    };

    consumeStream();

    return () => {
      isCancelled = true;
    };
  }, []); // Empty dependency array - only run once on mount

  return {
    content,
    isStreaming,
    elapsed,
    error,
  };
}

/**
 * Hook for tracking elapsed time
 */
export function useTimer(isActive: boolean = true): number {
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  return elapsed;
}
