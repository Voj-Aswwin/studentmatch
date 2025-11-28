'use client'
 
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { registerUser } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export function RegisterForm() {
  const [state, dispatch] = useActionState(registerUser, undefined)
  const [showPassword, setShowPassword] = useState(false)
 
  return (
    <form action={dispatch}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to find study buddies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
                {state?.errors?.name && <p className="text-red-500 text-xs">{state.errors.name}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
               {state?.errors?.email && <p className="text-red-500 text-xs">{state.errors.email}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
               {state?.errors?.password && <p className="text-red-500 text-xs">{state.errors.password}</p>}
            </div>
             <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" name="contact" placeholder="123-456-7890" required />
               {state?.errors?.contact && <p className="text-red-500 text-xs">{state.errors.contact}</p>}
            </div>
          </div>
          <div className="mt-4">
            {state?.message && (
              <p aria-live="polite" className="text-sm text-red-500">
                {state.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
           <RegisterButton />
        </CardFooter>
      </Card>
    </form>
  )
}
 
function RegisterButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button className="w-full" aria-disabled={pending}>
      {pending ? 'Registering...' : 'Register'}
    </Button>
  )
}
