#!/usr/bin/env node
import React, { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import {
  MessagePanel,
  ResponsePanel,
  ReasoningPanel,
  ToolCallsPanel,
  WarningPanel,
  ProgressSpinner,
  useStreamingContent,
} from '../src/index.js';

/**
 * Advanced example showing:
 * - Multiple panels
 * - State management
 * - Sequential updates
 * - Different content types
 */

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolCall {
  name: string;
  args: any;
  result?: string;
}

async function* simulateComplexResponse() {
  const response = `After analyzing your code, I've identified several optimization opportunities:

1. Database queries can be batched to reduce latency
2. Consider implementing caching for frequently accessed data
3. The authentication flow has some redundant checks

I've executed the performance tests and the results show a 40% improvement.`;

  const words = response.split(' ');
  
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 40));
    yield { content: word + ' ' };
  }
}

function AdvancedExample() {
  const [stage, setStage] = useState<'input' | 'thinking' | 'tools' | 'response'>('input');
  const [reasoning, setReasoning] = useState('');
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  
  const userMessage = "Analyze my code and suggest optimizations";

  useEffect(() => {
    // Simulate progression through stages
    const stages: Array<typeof stage> = ['input', 'thinking', 'tools', 'response'];
    let currentStageIndex = 0;

    const timer = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex >= stages.length) {
        clearInterval(timer);
        return;
      }
      setStage(stages[currentStageIndex]);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage === 'thinking') {
      setReasoning('Analyzing code structure, checking for common anti-patterns...');
    }
    
    if (stage === 'tools') {
      setToolCalls([
        { name: 'analyze_code', args: { file: 'main.ts' }, result: 'Found 3 issues' },
        { name: 'run_tests', args: { suite: 'performance' }, result: 'All passed' },
      ]);
      setShowWarning(true);
    }
  }, [stage]);

  return (
    <Box flexDirection="column">
      {/* User message */}
      <MessagePanel>
        <Text color="white">{userMessage}</Text>
      </MessagePanel>

      {/* Thinking spinner and reasoning */}
      {stage === 'thinking' && (
        <>
          <Box marginY={1}>
            <ProgressSpinner text="Analyzing code..." isActive={true} />
          </Box>
          {reasoning && (
            <ReasoningPanel elapsed={1.5}>
              <Text color="white">{reasoning}</Text>
            </ReasoningPanel>
          )}
        </>
      )}

      {/* Tool execution */}
      {stage === 'tools' && (
        <>
          <Box marginY={1}>
            <ProgressSpinner text="Running tools..." isActive={true} />
          </Box>
          <ToolCallsPanel>
            {toolCalls.map((tc, i) => (
              <Box key={i} flexDirection="column">
                <Text color="yellow">
                  • {tc.name}({JSON.stringify(tc.args)})
                </Text>
                {tc.result && (
                  <Text color="gray" dimColor>
                    → {tc.result}
                  </Text>
                )}
              </Box>
            ))}
          </ToolCallsPanel>
        </>
      )}

      {/* Warning */}
      {showWarning && stage !== 'response' && (
        <Box marginY={1}>
          <WarningPanel>
            <Text color="yellow">
              Some code patterns detected may impact performance
            </Text>
          </WarningPanel>
        </Box>
      )}

      {/* Final response */}
      {stage === 'response' && (
        <StreamingResponse />
      )}
    </Box>
  );
}

function StreamingResponse() {
  const stream = simulateComplexResponse();
  const { content, isStreaming, elapsed } = useStreamingContent({
    iterator: stream,
  });

  return (
    <>
      {isStreaming && (
        <Box marginY={1}>
          <ProgressSpinner text="Generating response..." isActive={isStreaming} />
        </Box>
      )}
      
      {content && (
        <ResponsePanel elapsed={elapsed}>
          <Text color="white">{content}</Text>
        </ResponsePanel>
      )}
    </>
  );
}

render(<AdvancedExample />);
