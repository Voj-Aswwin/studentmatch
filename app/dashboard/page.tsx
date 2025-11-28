import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CreateSessionForm } from '@/components/sessions/CreateSessionForm'
import { SessionList } from '@/components/sessions/SessionList'
import { Navbar } from '@/components/Navbar'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
    try {
        const session = await auth()
        if (!session?.user?.email) return null // Middleware handles redirect

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        
        if (!currentUser) return null

        // Get the start of today in UTC to ensure we see today's sessions
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const openSessions = await prisma.session.findMany({
            where: {
                status: 'OPEN',
                date: {
                    gte: today 
                }
            },
            include: {
                creator: { select: { name: true } }
            },
            orderBy: { date: 'asc' }
        })

        // Get user's own sessions (both open and matched)
        const mySessions = await prisma.session.findMany({
            where: {
                creatorId: currentUser.id,
                date: {
                    gte: today
                }
            },
            include: {
                creator: { select: { name: true } }
            },
            orderBy: { date: 'asc' }
        })

        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20">
                <Navbar />
                <DashboardClient>
                    <main className="container mx-auto p-4">
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <CreateSessionForm />
                            </div>
                            
                            <div className="md:col-span-2 space-y-8">
                                {mySessions.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Sessions</h2>
                                        <SessionList sessions={mySessions} currentUserId={currentUser.id} />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Sessions</h2>
                                    <SessionList sessions={openSessions} currentUserId={currentUser.id} />
                                </div>
                            </div>
                        </div>
                    </main>
                </DashboardClient>
            </div>
        )
    } catch (error) {
        console.error("Dashboard rendering error:", error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                    <p className="text-gray-600 mb-4">We couldn't load your dashboard. Please check your connection and try again.</p>
                </div>
            </div>
        )
    }
}
