'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createSession } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialState = {
  message: '',
  success: false
}

export function CreateSessionForm() {
    const [state, dispatch] = useActionState(createSession, initialState)
    const [topicValue, setTopicValue] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            // Reset form
            setTopicValue('')
            router.refresh()
        }
    }, [state?.success, router])

    return (
        <form action={dispatch} className="w-full max-w-md mb-8">
            <input type="hidden" name="topic" value={topicValue} />
            <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/50 opacity-0 animate-scale-in">
                <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create Study Session
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic *</Label>
                        <Select value={topicValue} onValueChange={setTopicValue}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" name="time" type="time" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" name="duration" type="number" placeholder="60" />
                    </div>
                    {state?.message && (
                        <p className={`text-sm ${state.success ? 'text-green-500' : 'text-red-500'} animate-pulse`}>
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <SubmitButton topicValue={topicValue} />
                </CardFooter>
            </Card>
        </form>
    )
}

function SubmitButton({ topicValue }: { topicValue: string }) {
    const { pending } = useFormStatus()
    return (
        <Button 
            type="submit" 
            disabled={pending || !topicValue}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-transform"
        >
            {pending ? 'Creating...' : 'Create Session'}
        </Button>
    )
}
