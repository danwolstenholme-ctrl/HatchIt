
export type ArchitectNode = {
  type: string;
  content?: string;
  props: Record<string, string>;
  children: ArchitectNode[];
};

export function parseArchitect(input: string): ArchitectNode[] {
  const tokens = tokenize(input);
  const { nodes } = parseBlock(tokens);
  return nodes;
}

function tokenize(input: string): string[] {
  // Split by spaces, braces, brackets, quotes
  // This is a simplified tokenizer
  return input
    .replace(/([\{\}\[\]])/g, ' $1 ')
    .match(/(?:[^\s"]+|"[^"]*")+/g) || [];
}

function parseBlock(tokens: string[]): { nodes: ArchitectNode[], remaining: string[] } {
  const nodes: ArchitectNode[] = [];
  let current = tokens;

  while (current.length > 0) {
    const token = current[0];

    if (token === '}') {
      return { nodes, remaining: current.slice(1) };
    }

    if (token === ']' || token === '[') {
      // Skip stray brackets if any
      current = current.slice(1);
      continue;
    }

    // Assume token is a TAG
    const type = token;
    current = current.slice(1);

    let content = '';
    let props: Record<string, string> = {};
    let children: ArchitectNode[] = [];

    // Check for content (quoted string)
    if (current.length > 0 && current[0].startsWith('"')) {
      content = current[0].slice(1, -1);
      current = current.slice(1);
    }

    // Check for props [key:value]
    if (current.length > 0 && current[0] === '[') {
      current = current.slice(1);
      while (current.length > 0 && current[0] !== ']') {
        const prop = current[0];
        if (prop.includes(':')) {
          const [key, val] = prop.split(':');
          props[key] = val;
        } else {
          props[prop] = 'true';
        }
        current = current.slice(1);
      }
      if (current.length > 0 && current[0] === ']') {
        current = current.slice(1);
      }
    }

    // Check for children { ... }
    if (current.length > 0 && current[0] === '{') {
      const result = parseBlock(current.slice(1));
      children = result.nodes;
      current = result.remaining;
    }

    nodes.push({ type, content, props, children });
  }

  return { nodes, remaining: [] };
}

export function compileToReact(nodes: ArchitectNode[], indent = 0): string {
  const sp = '  '.repeat(indent);
  
  return nodes.map(node => {
    const type = node.type.toUpperCase();
    
    // Map Architect tags to Tailwind/React
    let jsxTag = 'div';
    let className = '';
    let extraProps = '';

    switch (type) {
      case 'SECTION':
        jsxTag = 'section';
        className = 'py-20 px-6 bg-zinc-950 text-white';
        break;
      case 'HERO':
        jsxTag = 'header';
        className = 'min-h-[80vh] flex flex-col justify-center items-center text-center bg-zinc-950 relative overflow-hidden';
        break;
      case 'GRID':
        jsxTag = 'div';
        const cols = node.props.cols || '3';
        const gap = node.props.gap || '6';
        className = `grid md:grid-cols-${cols} gap-${gap} w-full max-w-6xl mx-auto`;
        break;
      case 'CARD':
        jsxTag = 'div';
        className = 'p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-colors';
        break;
      case 'TITLE':
        jsxTag = 'h2';
        const size = node.props.size || '4xl';
        const gradient = node.props.gradient ? `bg-gradient-to-r from-${node.props.gradient}-400 to-teal-400 bg-clip-text text-transparent` : 'text-white';
        className = `text-${size} font-bold mb-4 ${gradient}`;
        break;
      case 'TEXT':
      case 'SUB':
        jsxTag = 'p';
        className = 'text-zinc-400 leading-relaxed mb-6 max-w-2xl';
        break;
      case 'BTN':
        jsxTag = 'button';
        const variant = node.props.variant === 'ghost' 
          ? 'bg-transparent border border-zinc-700 hover:bg-zinc-800' 
          : 'bg-emerald-500 hover:bg-emerald-600 text-white';
        className = `px-6 py-3 rounded-lg font-medium transition-all ${variant}`;
        break;
      case 'ROW':
        jsxTag = 'div';
        className = 'flex flex-wrap gap-4 items-center justify-center';
        break;
      case 'ICON':
        // In a real compiler we'd import Lucide
        return `${sp}<div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4"><span className="text-2xl">❖</span></div>`;
      default:
        className = '';
    }

    // Override with raw props if needed
    if (node.props.class) className += ` ${node.props.class}`;

    const childrenJsx = node.children.length > 0 
      ? `\n${compileToReact(node.children, indent + 1)}\n${sp}` 
      : (node.content || '');

    return `${sp}<${jsxTag} className="${className}">
${childrenJsx}
${sp}</${jsxTag}>`;
  }).join('\n');
}
