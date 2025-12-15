import React from 'react';
import { Panel, PanelProps } from './Panel.js';
import { defaultTheme } from '../themes/default.js';

interface ThemedPanelProps extends Omit<PanelProps, 'borderColor' | 'borderStyle'> {
  borderStyle?: PanelProps['borderStyle'];
}

/**
 * Message Panel - for displaying user input
 * Uses cyan border by default (matching Agno)
 */
export function MessagePanel({ children, ...props }: ThemedPanelProps) {
  return (
    <Panel borderColor={defaultTheme.message} borderStyle="heavy" title="Message" {...props}>
      {children}
    </Panel>
  );
}

/**
 * Response Panel - for displaying AI responses
 * Uses blue border by default (matching Agno)
 */
export function ResponsePanel({
  children,
  elapsed,
  ...props
}: ThemedPanelProps & { elapsed?: number }) {
  const title = elapsed !== undefined ? `Response (${elapsed.toFixed(1)}s)` : 'Response';

  return (
    <Panel borderColor={defaultTheme.response} borderStyle="heavy" title={title} {...props}>
      {children}
    </Panel>
  );
}

/**
 * Reasoning Panel - for displaying thinking/reasoning steps
 * Uses green border by default (matching Agno)
 */
export function ReasoningPanel({
  children,
  elapsed,
  ...props
}: ThemedPanelProps & { elapsed?: number }) {
  const title = elapsed !== undefined ? `Thinking (${elapsed.toFixed(1)}s)` : 'Thinking';

  return (
    <Panel borderColor={defaultTheme.reasoning} borderStyle="heavy" title={title} {...props}>
      {children}
    </Panel>
  );
}

/**
 * Tool Calls Panel - for displaying tool execution
 * Uses yellow border by default (matching Agno)
 */
export function ToolCallsPanel({ children, ...props }: ThemedPanelProps) {
  return (
    <Panel borderColor={defaultTheme.toolCalls} borderStyle="heavy" title="Tool Calls" {...props}>
      {children}
    </Panel>
  );
}

/**
 * Error Panel - for displaying errors
 * Uses red border by default
 */
export function ErrorPanel({ children, ...props }: ThemedPanelProps) {
  return (
    <Panel borderColor={defaultTheme.error} borderStyle="heavy" title="Error" {...props}>
      {children}
    </Panel>
  );
}

/**
 * Warning Panel - for displaying warnings
 * Uses yellow border by default
 */
export function WarningPanel({ children, ...props }: ThemedPanelProps) {
  return (
    <Panel borderColor={defaultTheme.warning} borderStyle="heavy" title="Warning" {...props}>
      {children}
    </Panel>
  );
}
