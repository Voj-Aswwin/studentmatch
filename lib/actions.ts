'use server'

import { signIn, signOut, auth } from '@/auth'
import { AuthError } from 'next-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- Auth Actions ---

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contact: z.string().min(1, 'Contact number is required'),
})

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
  redirect('/dashboard')
}

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        contact: formData.get('contact'),
    })

    if (!validatedFields.success) {
        return { message: 'Invalid fields', errors: validatedFields.error.flatten().fieldErrors }
    }

    const { name, email, password, contact } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
             return { message: 'User already exists.' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                contact,
            },
        })
    } catch (error) {
        console.error(error)
        return { message: 'Database Error: Failed to Create User.' }
    }
    
    redirect('/login')
}

// --- Session Actions ---

const CreateSessionSchema = z.object({
    topic: z.string().min(1),
    date: z.string(), // We will parse this
    time: z.string(),
    duration: z.coerce.number().optional(),
})

export async function createSession(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { message: 'Not authenticated' }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!currentUser) return { message: 'User not found' }

    const validatedFields = CreateSessionSchema.safeParse({
        topic: formData.get('topic'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
    })

    if (!validatedFields.success) {
        return { message: 'Invalid fields', errors: validatedFields.error.flatten().fieldErrors }
    }

    const { topic, date, time, duration } = validatedFields.data
    
    try {
        await prisma.session.create({
            data: {
                topic,
                date: new Date(date),
                time,
                duration,
                creatorId: currentUser.id,
                status: 'OPEN'
            }
        })
        revalidatePath('/dashboard')
        return { message: 'Session created!', success: true }
    } catch (error) {
        console.error(error)
        return { message: 'Failed to create session.' }
    }
}

export async function matchSession(formData: FormData) {
    const sessionId = formData.get('sessionId') as string
    if (!sessionId) {
        throw new Error('Session ID is required')
    }

    const session = await auth()
    if (!session?.user?.email) {
        throw new Error('Not authenticated')
    }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!currentUser) {
        throw new Error('User not found')
    }

    try {
        // Check if session is open and not created by current user
        const targetSession = await prisma.session.findUnique({ where: { id: sessionId } })
        if (!targetSession) {
            throw new Error('Session not found')
        }
        if (targetSession.status !== 'OPEN') {
            throw new Error('Session not available')
        }
        if (targetSession.creatorId === currentUser.id) {
            throw new Error('Cannot match your own session')
        }

        await prisma.session.update({
            where: { id: sessionId },
            data: {
                matchedUserId: currentUser.id,
                status: 'MATCHED'
            }
        })
        revalidatePath('/dashboard')
        revalidatePath('/sessions')
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function deleteSession(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) {
        return { message: 'Not authenticated', success: false }
    }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!currentUser) {
        return { message: 'User not found', success: false }
    }

    const sessionId = formData.get('sessionId') as string
    if (!sessionId) {
        return { message: 'Session ID is required', success: false }
    }

    try {
        // Verify the session exists and belongs to the user
        const existingSession = await prisma.session.findUnique({ where: { id: sessionId } })
        if (!existingSession) {
            return { message: 'Session not found', success: false }
        }
        if (existingSession.creatorId !== currentUser.id) {
            return { message: 'Not authorized to delete this session', success: false }
        }
        if (existingSession.status !== 'OPEN') {
            return { message: 'Can only delete open sessions', success: false }
        }

        await prisma.session.delete({
            where: { id: sessionId }
        })
        revalidatePath('/dashboard')
        revalidatePath('/sessions')
        return { message: 'Session deleted successfully', success: true }
    } catch (error) {
        console.error(error)
        return { message: error instanceof Error ? error.message : 'Failed to delete session', success: false }
    }
}

export async function signOutAction() {
    try {
        await signOut({ redirectTo: '/' })
    } catch (error) {
        // Next.js redirects by throwing, so we need to re-throw redirects
        if (error && typeof error === 'object' && 'type' in error) {
            if (error.type === 'NEXT_REDIRECT') {
                throw error
            }
        }
        // If there's any other error, still try to redirect
        redirect('/')
    }
}
