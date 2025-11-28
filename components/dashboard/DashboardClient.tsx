'use client'

import { ReactNode } from 'react'

export function DashboardClient({ children }: { children: ReactNode }) {
  return <div className="opacity-0 animate-fade-in">{children}</div>
}

