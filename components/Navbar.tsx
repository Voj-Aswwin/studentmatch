import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 border-b">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xl font-bold">Study Buddy Match</Link>
        <Link href="/dashboard" className="hover:underline">Calendar</Link>
        <Link href="/sessions" className="hover:underline">Planned Sessions</Link>
      </div>
      <form action={async () => {
        'use server'
        await signOut()
      }}>
        <Button variant="outline">Sign Out</Button>
      </form>
    </nav>
  )
}

