/**
 * Escape special tags that should not be processed
 * Similar to Agno's handling of <think> tags
 */

const ESCAPE_PATTERNS = [
  { tag: 'think', display: '[THINKING]' },
  { tag: 'tool', display: '[TOOL]' },
  { tag: 'system', display: '[SYSTEM]' },
];

/**
 * Escape special XML-like tags in content
 */
export function escapeSpecialTags(content: string): string {
  let escaped = content;

  for (const pattern of ESCAPE_PATTERNS) {
    const openTag = `<${pattern.tag}>`;
    const closeTag = `</${pattern.tag}>`;

    // Replace opening and closing tags
    escaped = escaped.replace(new RegExp(openTag, 'g'), pattern.display);
    escaped = escaped.replace(new RegExp(closeTag, 'g'), '');
  }

  return escaped;
}

/**
 * Strip all XML-like tags from content
 */
export function stripTags(content: string): string {
  return content.replace(/<[^>]+>/g, '');
}

/**
 * Extract content between specific tags
 */
export function extractTagContent(content: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 's');
  const match = content.match(regex);
  return match ? match[1] : null;
}
