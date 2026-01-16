import { StreamingPanel, type StreamingPanelOptions } from './StreamingPanel.js';

export type ReasoningPanelOptions = Omit<StreamingPanelOptions, 'borderColor' | 'borderStyle'>;

/**
 * A streaming panel styled for reasoning/thinking content
 * Uses green border with single style by default
 *
 * @example
 * ```ts
 * const reasoning = new ReasoningPanel({ title: 'Thinking' })
 * reasoning.start()
 * reasoning.append('Analyzing the problem...')
 * reasoning.finish()
 * ```
 */
export class ReasoningPanel extends StreamingPanel {
  constructor(options: ReasoningPanelOptions = {}) {
    super({
      ...options,
      title: options.title ?? 'Reasoning',
      borderColor: 'green',
      borderStyle: 'single',
    });
  }
}
