import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/Navbar'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

export default async function PlannedSessionsPage() {
    const session = await auth()
    if (!session?.user?.email) return null

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!currentUser) return null

    const mySessions = await prisma.session.findMany({
        where: {
            OR: [
                { creatorId: currentUser.id },
                { matchedUserId: currentUser.id }
            ]
        },
        include: {
            creator: { select: { id: true, name: true, email: true, contact: true } },
            matchedUser: { select: { id: true, name: true, email: true, contact: true } }
        },
        orderBy: { date: 'asc' }
    })

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">My Planned Sessions</h1>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mySessions.map(session => {
                        const isCreator = session.creatorId === currentUser.id
                        const partner = isCreator ? session.matchedUser : session.creator
                        
                        return (
                            <Card key={session.id} className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle>{session.topic}</CardTitle>
                                    <div className="text-sm text-gray-500">
                                        {format(new Date(session.date), 'PPP')} at {session.time}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold">Status: {session.status}</p>
                                    {session.duration && <p className="text-sm">Duration: {session.duration} min</p>}
                                    
                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                        <p className="text-sm font-medium">Study Partner:</p>
                                        {partner ? (
                                            <div className="text-sm">
                                                <p>Name: {partner.name}</p>
                                                <p>Email: {partner.email}</p>
                                                <p>Contact: {partner.contact}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm italic text-gray-500">Waiting for a match...</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                    {mySessions.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">You have no planned sessions.</p>
                    )}
                </div>
            </main>
        </div>
    )
}
