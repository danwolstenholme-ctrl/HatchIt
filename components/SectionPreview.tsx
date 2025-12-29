'use client'

import { useMemo, useState } from 'react'

interface SectionPreviewProps {
  code: string
  allSectionsCode?: Record<string, string>
  darkMode?: boolean
}

export default function SectionPreview({ code, allSectionsCode = {}, darkMode = true }: SectionPreviewProps) {
  const [hasError, setHasError] = useState(false)

  const srcDoc = useMemo(() => {
    if (!code) return ''

    // Combine all sections for full-page preview context
    const allCode = Object.values(allSectionsCode).join('\n\n')
    const combinedCode = allCode || code

    const hooksDestructure = `const { useState, useEffect, useMemo, useCallback, useRef, Fragment } = React;`

    // Clean code for browser execution
    let cleanedCode = combinedCode
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '')
      .replace(/import\s+.*?from\s+['"].*?['"]\s*;?/g, '') // Remove imports
      .replace(/React\.useState/g, 'useState')
      .replace(/React\.useEffect/g, 'useEffect')
      .replace(/React\.useMemo/g, 'useMemo')
      .replace(/React\.useCallback/g, 'useCallback')
      .replace(/React\.useRef/g, 'useRef')
      .replace(/React\.Fragment/g, 'Fragment')
    
    // Auto-wrap raw JSX in a function component (fallback for AI that returns raw JSX)
    const trimmedCode = cleanedCode.trim()
    if (trimmedCode.startsWith('<') || trimmedCode.startsWith('{/*')) {
      // This is raw JSX without a function wrapper - wrap it
      cleanedCode = `function GeneratedSection() {\n  return (\n${trimmedCode}\n  )\n}`
      console.log('Auto-wrapped raw JSX in GeneratedSection component')
    }

    // Detect component names from the code using regex
    const componentRegex = /(?:function|const|let|var)\s+([A-Z][a-zA-Z0-9]*)(?:\s*[=:(]|\s*:)/g
    const matches = [...combinedCode.matchAll(componentRegex)]
    const componentNames = matches.map(m => m[1])
    
    // Build a list of potential component names to try
    const potentialComponents = [...new Set([
      ...componentNames,
      'GeneratedSection', // Auto-wrapped fallback
      'Component',
      'HeroSection',
      'Hero',
      'FeaturesSection',
      'Features',
      'AboutSection',
      'About',
      'ContactSection',
      'Contact',
      'CTASection',
      'CTA',
      'Footer',
      'Header',
      'Nav',
      'Navbar',
      'Section',
      'Page',
      'App',
      'Main'
    ])]

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            zinc: {
              950: '#09090b',
              900: '#18181b',
              800: '#27272a',
              700: '#3f3f46',
              600: '#52525b',
              500: '#71717a',
              400: '#a1a1aa',
              300: '#d4d4d8',
              200: '#e4e4e7',
              100: '#f4f4f5',
            }
          }
        }
      }
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    html, body, #root { 
      min-height: 100%;
      width: 100%;
    }
    body {
      background: ${darkMode ? '#09090b' : '#ffffff'};
      color: ${darkMode ? '#ffffff' : '#18181b'};
    }
    .error-display { 
      color: #f87171; 
      padding: 2rem; 
      font-family: ui-monospace, monospace; 
      font-size: 0.75rem;
      white-space: pre-wrap;
      background: #18181b;
      border-radius: 0.5rem;
      margin: 1rem;
    }
    /* Smooth scrolling for anchor links */
    [data-scroll] { scroll-behavior: smooth; }
  </style>
</head>
<body class="${darkMode ? 'dark' : ''}">
  <div id="root"></div>
  
  <!-- Dependencies -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
  <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
  
  <!-- Shims -->
  <script>
    // Framer Motion shims
    window.motion = window.Motion?.motion || window.FramerMotion?.motion;
    window.AnimatePresence = window.Motion?.AnimatePresence || window.FramerMotion?.AnimatePresence || function(p) { return p.children; };
    window.useInView = window.Motion?.useInView || function() { return true; };
    window.useScroll = window.Motion?.useScroll || function() { return { scrollY: 0, scrollYProgress: 0 }; };
    window.useTransform = window.Motion?.useTransform || function(v) { return v; };
    
    // Lucide shims - provide common icons as simple components
    const iconShim = (name) => (props) => React.createElement('span', { 
      ...props, 
      style: { display: 'inline-flex', width: props?.size || 24, height: props?.size || 24 }
    }, '⬡');
    
    if (!window.lucide) window.lucide = {};
    const iconNames = ['Menu', 'X', 'ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp', 
      'ArrowRight', 'ArrowLeft', 'Check', 'Star', 'Heart', 'Mail', 'Phone', 'MapPin',
      'Github', 'Twitter', 'Linkedin', 'Instagram', 'Facebook', 'Youtube', 'ExternalLink',
      'Search', 'User', 'Settings', 'Home', 'Plus', 'Minus', 'Edit', 'Trash', 'Copy',
      'Download', 'Upload', 'Share', 'Send', 'Bell', 'Calendar', 'Clock', 'Globe',
      'Lock', 'Unlock', 'Eye', 'EyeOff', 'Filter', 'Grid', 'List', 'MoreHorizontal',
      'MoreVertical', 'RefreshCw', 'RotateCcw', 'Save', 'Zap', 'Award', 'Target',
      'TrendingUp', 'BarChart', 'PieChart', 'Activity', 'Layers', 'Box', 'Package',
      'Cpu', 'Database', 'Server', 'Cloud', 'Code', 'Terminal', 'FileText', 'Folder',
      'Image', 'Video', 'Music', 'Headphones', 'Mic', 'Camera', 'Bookmark', 'Tag'];
    iconNames.forEach(name => { 
      if (!window.lucide[name]) window.lucide[name] = iconShim(name); 
    });

    // Handle link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Error reporting
    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ type: 'preview-error', message: msg, line: line }, '*');
    };
  </script>
  
  <script type="text/babel" data-presets="react,typescript">
    ${hooksDestructure}
    
    // Framer Motion
    const motion = window.motion || { div: 'div', span: 'span', button: 'button', a: 'a', p: 'p', h1: 'h1', h2: 'h2', h3: 'h3', section: 'section', nav: 'nav', ul: 'ul', li: 'li', img: 'img', form: 'form', input: 'input' };
    const AnimatePresence = window.AnimatePresence;
    const useInView = window.useInView;
    const useScroll = window.useScroll;
    const useTransform = window.useTransform;
    
    // Lucide icons
    const { Menu, X, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Check, Star, Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Facebook, Youtube, ExternalLink, Search, User, Settings, Home, Plus, Minus, Edit, Trash, Copy, Download, Upload, Share, Send, Bell, Calendar, Clock, Globe, Lock, Unlock, Eye, EyeOff, Filter, Grid, List, MoreHorizontal, MoreVertical, RefreshCw, RotateCcw, Save, Zap, Award, Target, TrendingUp, BarChart, PieChart, Activity, Layers, Box, Package, Cpu, Database, Server, Cloud, Code, Terminal, FileText, Folder, Image, Video, Music, Headphones, Mic, Camera, Bookmark, Tag } = window.lucide || {};
    
    // Helper for missing icons
    const Icon = ({ name, size = 24, className = '' }) => (
      <span className={className} style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>⬡</span>
    );
    
    // User's generated code
    ${cleanedCode}
    
    // Render - dynamically find and render the component
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      // Try each potential component name
      const potentialComponents = ${JSON.stringify(potentialComponents)};
      let ComponentToRender = null;
      
      for (const name of potentialComponents) {
        try {
          const comp = eval(name);
          if (typeof comp === 'function') {
            ComponentToRender = comp;
            console.log('Found component:', name);
            break;
          }
        } catch (e) {
          // Component not found, try next
        }
      }
      
      if (ComponentToRender) {
        root.render(
          <React.StrictMode>
            <ComponentToRender />
          </React.StrictMode>
        );
      } else {
        throw new Error('No valid React component found. Detected names: ' + potentialComponents.slice(0, 5).join(', '));
      }
    } catch (err) {
      console.error('Render error:', err);
      document.getElementById('root').innerHTML = '<div class="error-display">Render Error: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`
  }, [code, allSectionsCode, darkMode])

  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600">
        <div className="text-center">
          <div className="text-4xl mb-3">🎨</div>
          <p>Preview will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <iframe
        srcDoc={srcDoc}
        className="w-full h-full border-0"
        sandbox="allow-scripts"
        title="Section Preview"
        onLoad={() => setHasError(false)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80">
          <div className="text-red-400 text-sm">Preview failed to load</div>
        </div>
      )}
    </div>
  )
}
