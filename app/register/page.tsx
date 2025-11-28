'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="opacity-0 animate-fade-in">
        <RegisterForm />
      </div>
      <p className="mt-4 text-sm text-gray-600 opacity-0 animate-fade-in animate-delay-200">
        Already have an account? <a href="/login" className="underline text-blue-600 hover:text-blue-700 font-semibold">Login</a>
      </p>
    </main>
  )
}

