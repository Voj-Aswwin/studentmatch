'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Calendar, Zap, Target, BookOpen, Clock } from 'lucide-react'
import { useEffect, useRef } from 'react'
import React from 'react'

export default function LandingPage() {
  const statRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Simple counter animation for stats
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statItem = entry.target as HTMLElement
            const numberEl = statItem.querySelector('.stat-number')
            const targetValue = parseInt(statItem.getAttribute('data-value') || '0')
            
            if (numberEl) {
              let current = 0
              const increment = targetValue / 60
              const timer = setInterval(() => {
                current += increment
                if (current >= targetValue) {
                  numberEl.textContent = targetValue.toString()
                  clearInterval(timer)
                } else {
                  numberEl.textContent = Math.floor(current).toString()
                }
              }, 16)
            }
            
            observer.unobserve(statItem)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Use setTimeout to ensure refs are set after render
    const timeoutId = setTimeout(() => {
      statRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      statRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Navigation */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center animate-fade-in">
          <div className="text-xl font-bold tracking-tighter">Study Buddy Match</div>
          <div className="space-x-4">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Log in</Link>
              <Link href="/register" className="text-sm px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">Sign up</Link>
          </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        
        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
            
            {/* Main Heading */}
            <div className="mb-8">
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent pb-4 opacity-0 animate-hero-reveal">
                    Find Your
                </h1>
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 opacity-0 animate-hero-reveal animate-delay-200">
                    Study Mate
                </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light opacity-0 animate-fade-in animate-delay-300">
                The intelligent platform connecting students for productive study sessions. 
                Match instantly. Learn together.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in animate-delay-300">
                <Link href="/register">
                    <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-white text-black hover:bg-gray-200 transition-all hover:scale-105">
                        Start Matching
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="#features">
                    <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-lg text-gray-400 hover:text-white hover:bg-white/10">
                        Explore Features
                    </Button>
                </Link>
            </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-4 bg-zinc-950 relative z-10">
        <div className="container mx-auto max-w-7xl">
            <div className="mb-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Built for <span className="text-purple-400">Academic Success</span>
                </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={<Users className="w-6 h-6 text-purple-400" />}
                    title="Smart Matching"
                    desc="Our algorithm connects you with partners based on subject, schedule, and study style."
                />
                <FeatureCard 
                    icon={<Calendar className="w-6 h-6 text-blue-400" />}
                    title="Flexible Scheduling"
                    desc="Book sessions that fit your life. Syncs automatically with your dashboard."
                />
                <FeatureCard 
                    icon={<Zap className="w-6 h-6 text-yellow-400" />}
                    title="Instant Connect"
                    desc="No waiting lists. Find a peer who is ready to study right now."
                />
                <FeatureCard 
                    icon={<Target className="w-6 h-6 text-red-400" />}
                    title="Subject Focus"
                    desc="Filter by specific topics from Calculus to Quantum Physics."
                />
                <FeatureCard 
                    icon={<Clock className="w-6 h-6 text-green-400" />}
                    title="Session Timer"
                    desc="Built-in productivity tools to keep your sessions on track."
                />
                <FeatureCard 
                    icon={<BookOpen className="w-6 h-6 text-pink-400" />}
                    title="Resource Share"
                    desc="Collaborate on notes and materials within your session group."
                />
            </div>
        </div>
      </section>

      {/* Stats Section (Minimal) */}
      <section className="py-32 border-y border-white/5 bg-black">
          <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                  <StatItem ref={(el) => { statRefs.current[0] = el }} value="1000" label="Active Students" />
                  <StatItem ref={(el) => { statRefs.current[1] = el }} value="500" label="Daily Sessions" />
                  <StatItem ref={(el) => { statRefs.current[2] = el }} value="95" label="Success Rate (%)" />
              </div>
          </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 px-4 text-center relative overflow-hidden">
          {/* Background glow for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
                  Ready to excel?
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                  Join the community of students boosting their grades through collaborative learning.
              </p>
              <Link href="/register">
                <Button className="h-16 px-10 text-xl rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    Get Started Now
                </Button>
              </Link>
          </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/10 bg-black text-center md:text-left">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-500 text-sm">
                  © 2024 Study Buddy Match. All rights reserved.
              </div>
              <div className="flex gap-8 text-sm font-medium text-gray-400">
                  <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                  <Link href="#" className="hover:text-white transition-colors">Contact</Link>
              </div>
          </div>
      </footer>

    </div>
  )
}

// Helper Components for cleaner code

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group opacity-0 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-black/50 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}

const StatItem = React.forwardRef<HTMLDivElement, { value: string, label: string }>(
  ({ value, label }, ref) => {
    return (
        <div ref={ref} className="opacity-0 animate-fade-in" data-value={value}>
            <div className="stat-number text-6xl md:text-8xl font-bold mb-2 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
                0
            </div>
            <div className="text-lg text-gray-500 uppercase tracking-widest font-medium">{label}</div>
        </div>
    )
  }
)
StatItem.displayName = 'StatItem'
