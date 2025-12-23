'use client'

import { useMemo } from 'react'

interface LivePreviewProps {
  code: string
}

export default function LivePreview({ code }: LivePreviewProps) {
  const srcDoc = useMemo(() => {
    if (!code) return ''

    const needsUseState = code.includes('useState')
    const needsUseEffect = code.includes('useEffect')
    const needsUseMemo = code.includes('useMemo')
    
    const hooks = []
    if (needsUseState) hooks.push('useState')
    if (needsUseEffect) hooks.push('useEffect')
    if (needsUseMemo) hooks.push('useMemo')
    
    const hooksDestructure = hooks.length > 0 
      ? `const { ${hooks.join(', ')} } = React;`
      : ''

    // Remove export statements for browser execution
    const cleanedCode = code
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '')

    return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { 
      background: #18181b; 
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .error { color: #ef4444; padding: 1rem; font-family: monospace; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="react,typescript">
    ${hooksDestructure}
    
    ${cleanedCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Component />);
  </script>
</body>
</html>`
  }, [code])

  return (
    <div className="flex-1 bg-zinc-900">
      {code ? (
        <iframe
          srcDoc={srcDoc}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Live Preview"
        />
      ) : (
        <div className="p-4 text-sm text-zinc-600">
          Live preview will render here.
        </div>
      )}
    </div>
  )
}