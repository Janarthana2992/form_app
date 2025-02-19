'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

interface UserInput {
  name: string
  age: number
  email: string
  phone: string
  dob: string
}

// Custom error logger that doesn't log to console in production
const logError = (error: any, context: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context}:`, error)
  }
  
}

export type User = {
  id: number
  name: string
  email: string
  phoneNumber: string
  age: number
  dateOfBirth: string
}

export async function createUser(data: UserInput) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        age: data.age,
        email: data.email,
        phoneNumber: data.phone,
        dateOfBirth: new Date(data.dob),
      },
    })
    
    revalidatePath('/users')
    return { success: true, data: user }
  } catch (error) {
    logError(error, 'User creation failed')
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined
        const field = target?.[0]
        if (field === 'phoneNumber') {
          return {
            success: false,
            error: 'This phone number is already registered',
            field: 'phone'
          }
        }
        if (field === 'email') {
          return {
            success: false,
            error: 'This email is already registered',
            field: 'email'
          }
        }
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred while registering',
      field: null
    }
  }
}

export async function getUsers() {
  try {
    // Debug: Log the query execution
    console.log('Fetching users...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        phoneNumber: true,
        dateOfBirth: true,
      },
    })
    
    // Debug: Log the results
    console.log('Users found:', users.length)
    console.log('First user:', users[0])
    
    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      error: 'Failed to fetch users'
    }
  }
}

export async function deleteUser(userId: number) {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
    
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: 'Failed to delete user'
    }
  }
} 