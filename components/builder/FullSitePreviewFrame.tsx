'use client'

import { useMemo } from 'react'

const sanitizeSvgDataUrls = (input: string) => {
  return input.replace(/url\(['"]?(data:image\/svg\+xml[^'")\s]+)['"]?\)/gi, (_match, data) => {
    const safe = String(data).replace(/"/g, '%22').replace(/'/g, '%27')
    return `url("${safe}")`
  })
}

interface FullSitePreviewFrameProps {
  sections: { id: string; code: string }[]
  deviceView: 'mobile' | 'tablet' | 'desktop'
  seo?: { title: string; description: string; keywords: string }
}

export default function FullSitePreviewFrame({ sections, deviceView, seo }: FullSitePreviewFrameProps) {
  const srcDoc = useMemo(() => {
    if (!sections || sections.length === 0) return ''

    const allLucideImports = new Set<string>()
    const processedSections = sections.map((section, index) => {
      let code = sanitizeSvgDataUrls(section.code || '')

      const lucideImportRegex = /import\s+\{(.*?)\}\s+from\s+['"]lucide-react['"]/g
      let match: RegExpExecArray | null
      while ((match = lucideImportRegex.exec(code)) !== null) {
        match[1].split(',').forEach((s) => allLucideImports.add(s.trim()))
      }

      code = code
        .replace(/'use client';?/g, '')
        .replace(/"use client";?/g, '')
        .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')

      code = code.replace(/export\s+default\s+function\s+(\w+)?/g, (_m, name) => {
        return `const Section_${index} = function ${name || ''}`
      })
      code = code.replace(/export\s+default\s+/g, `const Section_${index} = `)

      return code
    })

    const appComponent = `
      function SafeSection({ component: Component }) {
        if (!Component) return null;
        try {
          if (typeof Component === 'function') return <Component />;
          if (React.isValidElement(Component)) return Component;
          console.warn('Invalid section export type:', typeof Component, Component);
          return <div className="p-4 text-red-500 border border-red-500 rounded bg-red-950/50">
            <p className="font-bold">Section Error</p>
            <p className="text-sm opacity-75">Invalid export type: {typeof Component}</p>
          </div>;
        } catch (err) {
          console.error('Section render error:', err);
          const msg = err && err.message ? err.message : 'Unknown error';
          return <div className="p-4 text-red-500 border border-red-500 rounded bg-red-950/50">
            <p className="font-bold">Render Error</p>
            <p className="text-sm opacity-75">{msg}</p>
          </div>;
        }
      }

      function App() {
        const Header = ${sections.findIndex((s) => s.id === 'header') >= 0 ? `Section_${sections.findIndex((s) => s.id === 'header')}` : 'null'};
        const Footer = ${sections.findIndex((s) => s.id === 'footer') >= 0 ? `Section_${sections.findIndex((s) => s.id === 'footer')}` : 'null'};
        const BodySections = [
          ${sections
            .map((_, i) => i)
            .filter((i) => sections[i]?.id !== 'header' && sections[i]?.id !== 'footer')
            .map((i) => `Section_${i}`)
            .join(', ')}
        ];

        return (
          <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {Header ? (
              <div className="shrink-0"><SafeSection component={Header} /></div>
            ) : null}

            <div className="flex-1">
              {BodySections.map((C, idx) => (
                <SafeSection key={idx} component={C} />
              ))}
            </div>

            {Footer ? (
              <div className="shrink-0"><SafeSection component={Footer} /></div>
            ) : null}
          </div>
        );
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    `

    const lucideDestructuring = allLucideImports.size > 0
      ? `var _icons = window.LucideIcons || {};
${Array.from(allLucideImports)
  .map((name) => {
    if (name === 'Image') return 'var ImageIcon = _icons.Image;'
    if (name === 'Link') return 'var LinkIcon = _icons.Link;'
    return 'var ' + name + ' = _icons.' + name + ';'
  })
  .join('\n')}`
      : ''

    const fullScript = `
      ${lucideDestructuring}
      ${processedSections.join('\n\n')}
      ${appComponent}
    `

    return `<!DOCTYPE html>
<html class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${seo?.title ? `<title>${seo.title}</title>` : ''}
  ${seo?.description ? `<meta name="description" content="${seo.description}">` : ''}
  ${seo?.keywords ? `<meta name="keywords" content="${seo.keywords}">` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script>window.React = React; window.react = React;</script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script>window.ReactDOM = ReactDOM; window['react-dom'] = ReactDOM;</script>
  <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
  <script src="https://unpkg.com/lucide-react@0.294.0/dist/umd/lucide-react.js"></script>
  <script>
    const motionProxy = new Proxy(function() { return null; }, {
      get: (_target, prop) => (typeof prop === 'string' ? prop : 'div')
    });
    window.motion = (window.Motion && window.Motion.motion) || motionProxy;
    window.AnimatePresence = (window.Motion && window.Motion.AnimatePresence) || function({ children }) { return children; };

    const dummyIcon = function() { return null; };
    const lucideProxy = new Proxy({}, {
      get: (_target, prop) => {
        if (window.lucideReact && window.lucideReact[prop]) return window.lucideReact[prop];
        return dummyIcon;
      }
    });
    window.LucideIcons = window.lucideReact || lucideProxy;
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #09090b; color: #fff; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    const { motion, AnimatePresence } = window;

    var Image = (props) => {
      var { src, alt, className, style, fill, ...rest } = props;
      var fillStyle = fill ? { position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', ...style } : style;
      return <img src={src} alt={alt || ''} className={className} style={fillStyle} {...rest} />;
    };
    var Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;

    ${fullScript}
  </script>
</body>
</html>`
  }, [sections, seo, deviceView])

  return (
    <iframe
      title="Full site preview"
      className="w-full h-full bg-zinc-950"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      srcDoc={srcDoc}
    />
  )
}