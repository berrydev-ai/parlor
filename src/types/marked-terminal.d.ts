declare module 'marked-terminal' {
  import { Renderer } from 'marked';

  interface TerminalRendererOptions {
    code?: (code: string, lang?: string) => string;
    codespan?: (code: string) => string;
    strong?: (text: string) => string;
    em?: (text: string) => string;
    link?: (href: string, title: string | null, text: string) => string;
    heading?: (text: string, level: number) => string;
    list?: (body: string, ordered: boolean) => string;
    listitem?: (text: string) => string;
    blockquote?: (quote: string) => string;
    hr?: () => string;
    paragraph?: (text: string) => string;
    table?: (header: string, body: string) => string;
    tablerow?: (content: string) => string;
    tablecell?: (content: string, flags: { header: boolean; align: string | null }) => string;
    html?: (html: string) => string;
    image?: (href: string, title: string | null, text: string) => string;
    br?: () => string;
    del?: (text: string) => string;
    text?: (text: string) => string;
    checkbox?: (checked: boolean) => string;
    // Style options
    firstHeading?: string;
    showSectionPrefix?: boolean;
    unescape?: boolean;
    emoji?: boolean;
    width?: number;
    reflowText?: boolean;
    href?: string;
    tab?: number;
  }

  class TerminalRenderer extends Renderer {
    constructor(options?: TerminalRendererOptions);
  }

  export = TerminalRenderer;
}
