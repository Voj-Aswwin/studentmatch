import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
             <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter your email to reset your password.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        (Note: Email sending is not configured in this demo. Please contact admin.)
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button className="w-full">Send Reset Link</Button>
                </CardFooter>
                 <div className="text-center mt-4 pb-4">
                     <Link href="/login" className="text-sm underline">Back to Login</Link>
                 </div>
            </Card>
        </main>
    )
}


