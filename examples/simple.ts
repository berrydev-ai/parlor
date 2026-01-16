/**
 * Example: Simple API usage
 *
 * Run with: bun run examples/simple.ts
 */

import { parlor } from '../src/simple/index.js';

// Figlet header
parlor()
  .figlet('PARLOR', { color: 'cyan' })
  .newline()
  .render();

// Header divider
parlor()
  .header('Simple API Demo', { color: 'green' })
  .newline()
  .render();

// Panels
parlor()
  .message('This is a message panel (cyan border)')
  .newline()
  .response('This is a response panel (blue border)')
  .newline()
  .error('This is an error panel (red border)')
  .newline()
  .warn('This is a warning panel (yellow border)')
  .newline()
  .success('This is a success panel (green border)')
  .newline()
  .render();

// Description list
parlor()
  .header('Description List', { color: 'yellow' })
  .newline()
  .dl({
    Name: 'Parlor',
    Version: '0.1.0',
    Author: 'Berry Dev AI',
    License: 'MIT',
  })
  .newline()
  .render();

// Lists
parlor()
  .header('Lists', { color: 'magenta' })
  .newline()
  .text('Bullet list:')
  .list(['First item', 'Second item', 'Third item with a longer text that might wrap'])
  .newline()
  .text('Numbered list:')
  .numberedList(['Step one', 'Step two', 'Step three'])
  .newline()
  .render();

// Code block
parlor()
  .header('Code Block', { color: 'blue' })
  .newline()
  .code(
    `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`,
    'typescript'
  )
  .newline()
  .render();

// Panel with markdown
parlor()
  .header('Markdown Support', { color: 'cyan' })
  .newline()
  .panel('Here is some **bold** text and *italic* text, plus `inline code`.', {
    title: 'Markdown Panel',
    borderColor: 'white',
  })
  .newline()
  .render();

// Using toString() instead of render()
const output = parlor()
  .header('String Output')
  .message('This was captured as a string!')
  .toString();

console.log('--- Output captured as string ---');
console.log(output);
console.log('--- End of captured string ---');
