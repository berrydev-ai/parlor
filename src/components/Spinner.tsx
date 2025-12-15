import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

export interface ProgressSpinnerProps {
  text?: string;
  isActive?: boolean;
  color?: string;
  frames?: string[];
  interval?: number;
}

/**
 * Custom progress spinner matching Agno's aesthetic
 * Default: ▰▰▰▰▱▱▱ animation
 */
export function ProgressSpinner({
  text = 'Thinking...',
  isActive = true,
  color = 'cyan',
  frames,
  interval = 80,
}: ProgressSpinnerProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  // Default frames - progress bar style
  const defaultFrames = [
    '▰▱▱▱▱▱▱',
    '▰▰▱▱▱▱▱',
    '▰▰▰▱▱▱▱',
    '▰▰▰▰▱▱▱',
    '▰▰▰▰▰▱▱',
    '▰▰▰▰▰▰▱',
    '▰▰▰▰▰▰▰',
    '▱▰▰▰▰▰▰',
    '▱▱▰▰▰▰▰',
    '▱▱▱▰▰▰▰',
    '▱▱▱▱▰▰▰',
    '▱▱▱▱▱▰▰',
    '▱▱▱▱▱▱▰',
    '▱▱▱▱▱▱▱',
  ];

  const spinnerFrames = frames || defaultFrames;

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % spinnerFrames.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, spinnerFrames.length, interval]);

  if (!isActive) return null;

  return (
    <Box>
      <Text color={color}>
        {spinnerFrames[frameIndex]} {text}
      </Text>
    </Box>
  );
}

/**
 * Alternative: Dots spinner (like cli-spinners)
 */
export function DotsSpinner({
  text = 'Loading...',
  isActive = true,
  color = 'cyan',
}: Omit<ProgressSpinnerProps, 'frames' | 'interval'>) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  return (
    <ProgressSpinner text={text} isActive={isActive} color={color} frames={frames} interval={80} />
  );
}
