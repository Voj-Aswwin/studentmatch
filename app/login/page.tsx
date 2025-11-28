import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
       <p className="mt-4 text-sm">
        Don&apos;t have an account? <a href="/register" className="underline">Register</a>
      </p>
    </main>
  )
}

