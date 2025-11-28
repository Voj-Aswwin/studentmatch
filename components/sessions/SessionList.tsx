'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { matchSession } from "@/lib/actions"
import { format } from "date-fns"

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
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map(session => {
                const isCreator = session.creatorId === currentUserId
                const isOpen = session.status === 'OPEN'

                return (
                    <Card 
                        key={session.id} 
                        className={`opacity-0 animate-fade-in ${isOpen ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50' : 'border-gray-200'} transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
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
                        <CardFooter>
                            {!isCreator && isOpen && (
                                <form action={matchSession}>
                                    <input type="hidden" name="sessionId" value={session.id} />
                                    <Button type="submit" size="sm" className="hover:scale-105 transition-transform">
                                        Match
                                    </Button>
                                </form>
                            )}
                            {isCreator && isOpen && (
                                <Button variant="outline" size="sm" disabled>Your Session</Button>
                            )}
                            {!isOpen && (
                                <Button variant="ghost" size="sm" disabled>Matched</Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
            {sessions.length === 0 && (
                <p className="col-span-full text-center text-gray-500">No upcoming open sessions.</p>
            )}
        </div>
    )
}
