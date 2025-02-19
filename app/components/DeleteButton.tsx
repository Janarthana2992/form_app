'use client'

export default function DeleteButton({ userId }: { userId: number }) {
  return (
    <button
      onClick={() => alert(`Delete user ${userId}`)}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      type="button"
    >
      Delete
    </button>
  )
} 