'use client'

import { createUser } from '@/app/actions/users'
import { useState } from 'react'

interface FieldError {
  message: string;
  field: string | null;
}

export default function RegistrationForm() {
  const [error, setError] = useState<FieldError | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(false)

      // Validate form data before submission
      const phone = formData.get('phone') as string
      const email = formData.get('email') as string
      const age = formData.get('age') as string
      const name = formData.get('name') as string
      const dob = formData.get('dob') as string

      // Basic validation
      if (!phone || !email || !age || !name || !dob) {
        setError({
          message: 'Please fill in all required fields',
          field: null
        })
        return
      }

      const result = await createUser({
        name,
        age: parseInt(age),
        email,
        phone,
        dob,
      })

      if (result.success) {
        setSuccess(true)
        const form = document.querySelector('form') as HTMLFormElement
        form?.reset()
      } else {
        setError({
          message: result.error || 'An error occurred',
          field: result.field || null
        })

        if (result.field) {
          const inputElement = document.querySelector(`[name="${result.field}"]`) as HTMLInputElement
          if (inputElement) {
            inputElement.focus()
          }
        }
      }
    } catch (e) {
      // Handle errors silently without console logs
      setError({
        message: 'An unexpected error occurred. Please try again.',
        field: null
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add client-side validation
  const validateField = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (!value.trim()) {
      setError({
        message: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
        field: name
      })
      return false
    }

    if (name === 'phone') {
      // Basic phone validation
      const phoneRegex = /^\+?[\d\s-]{10,}$/
      if (!phoneRegex.test(value)) {
        setError({
          message: 'Please enter a valid phone number',
          field: 'phone'
        })
        return false
      }
    }

    if (name === 'email') {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setError({
          message: 'Please enter a valid email address',
          field: 'email'
        })
        return false
      }
    }

    // Clear errors for this field if validation passes
    if (error?.field === name) {
      setError(null)
    }
    return true
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          onBlur={validateField}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
            ${error?.field === 'email' ? 'border-red-300' : 'border-gray-300'}`}
        />
        {error?.field === 'email' && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          required
          onBlur={validateField}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
            ${error?.field === 'phone' ? 'border-red-300' : 'border-gray-300'}`}
        />
        {error?.field === 'phone' && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          name="age"
          id="age"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* General Error Message */}
      {error && !error.field && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-green-700 text-sm">User registered successfully!</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
} 