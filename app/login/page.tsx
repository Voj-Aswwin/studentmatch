'use client'

import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="opacity-0 animate-fade-in">
        <LoginForm />
      </div>
       <p className="mt-4 text-sm text-gray-600 opacity-0 animate-fade-in animate-delay-200">
        Don&apos;t have an account? <a href="/register" className="underline text-blue-600 hover:text-blue-700 font-semibold">Register</a>
      </p>
    </main>
  )
}

