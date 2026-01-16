/**
 * Extracted content from a stream chunk
 */
export interface StreamChunk {
  /** Main text content */
  text?: string;
  /** Reasoning/thinking content */
  reasoning?: string;
  /** Original chunk type (if available) */
  type?: string;
}

/**
 * Function that extracts content from a raw stream chunk
 */
export type StreamExtractor = (chunk: unknown) => StreamChunk;

/**
 * Pre-built extractors for common LLM streaming formats
 */
export const StreamExtractors = {
  /**
   * Mastra framework format
   * Chunks have type: 'text-delta' | 'reasoning-delta' with payload.text
   */
  mastra: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;
    const payload = c.payload as Record<string, unknown> | undefined;

    if (c.type === 'text-delta') {
      return { text: (payload?.text as string) || '', type: 'text-delta' };
    }
    if (c.type === 'reasoning-delta') {
      return { reasoning: (payload?.text as string) || '', type: 'reasoning-delta' };
    }
    return { type: c.type as string };
  },

  /**
   * OpenAI Chat Completions API format
   * Chunks have choices[0].delta.content
   */
  openai: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;
    const choices = c.choices as Array<Record<string, unknown>> | undefined;
    const delta = choices?.[0]?.delta as Record<string, unknown> | undefined;

    return {
      text: (delta?.content as string) || '',
      reasoning: (delta?.reasoning as string) || '',
    };
  },

  /**
   * OpenAI Responses API format (newer)
   * Chunks have type: 'response.output_text.delta' with delta string
   */
  openaiResponses: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;

    if (c.type === 'response.output_text.delta') {
      return { text: (c.delta as string) || '', type: 'text-delta' };
    }
    return { type: c.type as string };
  },

  /**
   * Anthropic Claude format
   * Chunks have type: 'content_block_delta' with delta.text or delta.thinking
   */
  anthropic: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;

    if (c.type === 'content_block_delta') {
      const delta = c.delta as Record<string, unknown> | undefined;
      if (delta?.type === 'text_delta') {
        return { text: (delta.text as string) || '', type: 'text-delta' };
      }
      if (delta?.type === 'thinking_delta') {
        return { reasoning: (delta.thinking as string) || '', type: 'reasoning-delta' };
      }
    }
    return { type: c.type as string };
  },

  /**
   * Vercel AI SDK v5 format
   * Chunks have type: 'text-delta' | 'reasoning-delta' with delta string
   */
  aiSdk: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;

    if (c.type === 'text-delta') {
      return { text: (c.delta as string) || '', type: 'text-delta' };
    }
    if (c.type === 'reasoning-delta') {
      return { reasoning: (c.delta as string) || '', type: 'reasoning-delta' };
    }
    return { type: c.type as string };
  },

  /**
   * Auto-detect format based on chunk structure
   * Tries to extract content from common patterns
   */
  auto: (chunk: unknown): StreamChunk => {
    if (!chunk || typeof chunk !== 'object') {
      return {};
    }

    const c = chunk as Record<string, unknown>;

    // Check for Mastra format (payload.text)
    if (c.payload && typeof c.payload === 'object') {
      const payload = c.payload as Record<string, unknown>;
      if (c.type === 'text-delta' && payload.text) {
        return { text: payload.text as string, type: 'text-delta' };
      }
      if (c.type === 'reasoning-delta' && payload.text) {
        return { reasoning: payload.text as string, type: 'reasoning-delta' };
      }
    }

    // Check for OpenAI format (choices[0].delta.content)
    if (Array.isArray(c.choices) && c.choices.length > 0) {
      const delta = (c.choices[0] as Record<string, unknown>)?.delta as
        | Record<string, unknown>
        | undefined;
      if (delta) {
        return {
          text: (delta.content as string) || '',
          reasoning: (delta.reasoning as string) || '',
        };
      }
    }

    // Check for Anthropic format (delta.text)
    if (c.type === 'content_block_delta' && c.delta && typeof c.delta === 'object') {
      const delta = c.delta as Record<string, unknown>;
      if (delta.type === 'text_delta') {
        return { text: (delta.text as string) || '', type: 'text-delta' };
      }
      if (delta.type === 'thinking_delta') {
        return { reasoning: (delta.thinking as string) || '', type: 'reasoning-delta' };
      }
    }

    // Check for AI SDK format (type + delta string)
    if (c.type === 'text-delta' && typeof c.delta === 'string') {
      return { text: c.delta, type: 'text-delta' };
    }
    if (c.type === 'reasoning-delta' && typeof c.delta === 'string') {
      return { reasoning: c.delta, type: 'reasoning-delta' };
    }

    // Check for direct content property
    if (typeof c.content === 'string') {
      return { text: c.content };
    }
    if (typeof c.text === 'string') {
      return { text: c.text };
    }

    return { type: c.type as string | undefined };
  },

  /**
   * Simple extractor that just looks for a text property
   */
  simple: (chunk: unknown): StreamChunk => {
    const c = chunk as Record<string, unknown>;
    return {
      text: (c.text as string) || (c.content as string) || '',
    };
  },
};
