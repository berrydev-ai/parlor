#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { AgentResponse } from '../src/index.js';

/**
 * Simulate a complete agent response with streaming
 */
async function* simulateAgentStream() {
  const response = "The trolley problem is a classic ethical dilemma that presents a scenario where a runaway trolley is heading toward five people tied to the tracks. You have the option to pull a lever to divert the trolley onto another track, where it will kill one person instead. This thought experiment raises questions about utilitarianism versus deontological ethics.";
  
  const words = response.split(' ');
  
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 30));
    yield { content: word + ' ' };
  }
}

/**
 * Complete agent response example
 */
function AgentResponseExample() {
  const stream = simulateAgentStream();
  
  return (
    <AgentResponse
      message="Solve the trolley problem."
      responseStream={stream}
      showMessage={true}
      showReasoning={true}
      reasoning="Analyzing the ethical frameworks..."
      toolCalls={[
        { name: 'search_web', args: { query: 'trolley problem philosophy' } },
        { name: 'analyze_ethics', args: { framework: 'utilitarianism' } },
      ]}
    />
  );
}

render(<AgentResponseExample />);
