import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { CreateSessionForm } from '@/components/sessions/CreateSessionForm'
import { SessionList } from '@/components/sessions/SessionList'
import { Navbar } from '@/components/Navbar'

export default async function DashboardPage() {
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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <CreateSessionForm />
                    </div>
                    
                    <div className="md:col-span-2">
                         <h2 className="text-xl font-semibold mb-4">Available Sessions</h2>
                         <SessionList sessions={openSessions} currentUserId={currentUser.id} />
                    </div>
                </div>
            </main>
        </div>
    )
}
