'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/actions'

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border-b shadow-sm opacity-0 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          Study Buddy Match
        </Link>
        <Link href="/dashboard" className="hover:underline text-gray-700 hover:text-blue-600 transition-colors">Calendar</Link>
        <Link href="/sessions" className="hover:underline text-gray-700 hover:text-blue-600 transition-colors">Planned Sessions</Link>
      </div>
      <form action={signOutAction}>
        <Button variant="outline" className="hover:scale-105 transition-transform" type="submit">
          Sign Out
        </Button>
      </form>
    </nav>
  )
}

