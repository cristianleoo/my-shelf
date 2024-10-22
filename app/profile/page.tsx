'use client';

import { useEffect, useCallback, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserStore } from '@/lib/userStore'
import ShelfGrid from '@/components/shelf/ShelfGrid'

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { supabaseUserId, setSupabaseUserId } = useUserStore()
  const [error, setError] = useState<string | null>(null)

  const fetchSupabaseUserId = useCallback(async (clerkId: string) => {
    try {
      const response = await fetch(`/api/user?clerkId=${clerkId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch Supabase user ID')
      }
      const data = await response.json()
      if (!data.supabaseUserId) {
        throw new Error('Supabase user ID not found in response')
      }
      setSupabaseUserId(data.supabaseUserId)
      setError(null)
    } catch (error) {
      console.error('Error fetching Supabase user ID:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }, [setSupabaseUserId])

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (!supabaseUserId) {
        fetchSupabaseUserId(user.id)
      }
    }
  }, [isLoaded, isSignedIn, user, supabaseUserId, fetchSupabaseUserId])

  if (!isLoaded || !isSignedIn) {
    return <div>Please sign in to view your profile.</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <p>Clerk User ID: {user.id}</p>
      <p>Supabase User ID: {supabaseUserId || 'Loading...'}</p>
      <section>
        <h2 className="text-2xl font-bold mb-4">Current Shelf</h2>
        <ShelfGrid shelfType="current" />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Tried Shelf</h2>
        <ShelfGrid shelfType="tried" />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        <ShelfGrid shelfType="wishlist" />
      </section>
    </div>
  )
}
