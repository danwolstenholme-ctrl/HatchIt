'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-40">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-400">AI-Powered React Generation</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Hatch
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                It
              </span>
            </h1>
            
            <div className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Hatch it. Ship it. <span className="text-blue-400">Scale it.</span>
            </div>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Transform natural language into production-ready React components. 
              <br />
              <span className="text-zinc-300">Built for developers who ship fast.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/builder" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden">
              <span className="relative z-10">Start Building Now</span>
            </Link>
            <a href="#how-it-works" className="px-8 py-4 bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800/80 border border-zinc-700 hover:border-zinc-600 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-8 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Superpowers for developers
            </h3>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Everything you need to go from idea to production in seconds, not hours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              {
                icon: "⚡",
                title: "Lightning Generation",
                description: "From prompt to component in under 3 seconds. No templates, no boilerplate.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: "🎨",
                title: "Live Canvas",
                description: "Interactive preview with real-time editing. See every change instantly.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "🧠",
                title: "Smart Iterations",
                description: "Conversational refinement. Just say what you want changed.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "🚀",
                title: "Production Ready",
                description: "TypeScript, Tailwind, and best practices built-in. Ship with confidence.",
                gradient: "from-blue-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl blur from-zinc-600 to-zinc-800"></div>
                <div className="relative bg-zinc-900/90 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-zinc-100 mb-4">{feature.title}</h4>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative px-8 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Four steps to greatness
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Describe", desc: "Tell us your vision in plain English. Be as detailed or as simple as you want.", color: "from-blue-500 to-cyan-500" },
              { step: "02", title: "Generate", desc: "Watch as AI crafts pixel-perfect React code with modern patterns and styling.", color: "from-purple-500 to-pink-500" },
              { step: "03", title: "Iterate", desc: "Refine with natural conversation. 'Make it bigger', 'Add animation', 'Change the color'.", color: "from-green-500 to-emerald-500" },
              { step: "04", title: "Ship", desc: "Copy production-ready code and integrate instantly. No cleanup needed.", color: "from-orange-500 to-red-500" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-zinc-700 to-transparent"></div>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-zinc-200 mb-4">{item.title}</h4>
                <p className="text-zinc-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-8 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-sm p-16 rounded-3xl border border-zinc-800 text-center">
              <h3 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  Ready to build the future?
                </span>
              </h3>
              <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
                Start building production-ready React components in seconds.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/builder" className="group relative px-12 py-5 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden">
                  <span className="relative z-10">Start Building Free</span>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-zinc-500">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Clean code output</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Export anywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-8 py-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">HatchIt</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2024 HatchIt. Built with HatchIt.</p>
        </div>
      </footer>
    </div>
  );
}