'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { matchSession, deleteSession } from "@/lib/actions"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"

type Session = {
    id: string
    topic: string
    date: Date
    time: string
    duration: number | null
    creatorId: string
    creator: { name: string }
    status: string
    matchedUserId: string | null
}

export function SessionList({ sessions, currentUserId }: { sessions: Session[], currentUserId: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async (sessionId: string) => {
        if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            const formData = new FormData()
            formData.append('sessionId', sessionId)
            
            startTransition(async () => {
                const result = await deleteSession(undefined, formData)
                if (result?.success) {
                    router.refresh()
                } else {
                    alert(result?.message || 'Failed to delete session')
                }
            })
        }
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map(session => {
                    const isCreator = session.creatorId === currentUserId
                    const isOpen = session.status === 'OPEN'

                    return (
                        <Card 
                            key={session.id} 
                            className={`opacity-0 animate-fade-in ${isOpen ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50' : 'border-gray-200'} transition-all hover:shadow-lg hover:-translate-y-1`}
                        >
                            <CardHeader>
                                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {session.topic}
                                </CardTitle>
                                <div className="text-sm text-gray-500">
                                    {format(new Date(session.date), 'PPP')} at {session.time}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Creator: {session.creator.name}</p>
                                {session.duration && <p className="text-sm">Duration: {session.duration} min</p>}
                                <p className="text-sm mt-2 font-semibold">Status: {session.status}</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                {!isCreator && isOpen && (
                                    <form action={matchSession} className="flex-1">
                                        <input type="hidden" name="sessionId" value={session.id} />
                                        <Button type="submit" size="sm" className="w-full hover:scale-105 transition-transform">
                                            Match
                                        </Button>
                                    </form>
                                )}
                                {isCreator && isOpen && (
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => handleDelete(session.id)}
                                        disabled={isPending}
                                        className="flex-1 hover:scale-105 transition-transform"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        {isPending ? 'Deleting...' : 'Delete'}
                                    </Button>
                                )}
                                {!isOpen && (
                                    <Button variant="ghost" size="sm" disabled className="w-full">Matched</Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
                {sessions.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">No upcoming open sessions.</p>
                )}
            </div>
        </>
    )
}
