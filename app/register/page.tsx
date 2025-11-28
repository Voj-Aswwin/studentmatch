import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <RegisterForm />
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="underline">Login</a>
      </p>
    </main>
  )
}

