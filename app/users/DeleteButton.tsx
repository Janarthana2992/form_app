'use client'

import { deleteUser } from '@/app/actions/users'
import { useState } from 'react'

export function DeleteButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteUser(Number(userId))
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      // Success feedback could be added here if needed
      // For now, the table will automatically update due to revalidatePath
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-3 py-1.5 rounded text-sm font-medium text-white
        ${isDeleting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors'
        }`}
      aria-busy={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
} 