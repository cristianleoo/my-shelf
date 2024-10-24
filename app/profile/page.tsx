'use client';

import { useEffect, useCallback, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserStore } from '@/lib/userStore'
import ShelfGrid from '@/components/shelf/ShelfGrid'
import Image from 'next/image'
import { Book, Smile } from 'react-feather'

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { supabaseUserId, setSupabaseUserId } = useUserStore()
  const [error, setError] = useState<string | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

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

  useEffect(() => {
    console.log('User object:', user);
    if (user?.imageUrl) {
      console.log('Raw user image URL:', user.imageUrl);
      if (typeof user.imageUrl === 'string' && user.imageUrl.startsWith('http')) {
        console.log('Setting valid image URL:', user.imageUrl);
        setProfileImageUrl(user.imageUrl);
      } else {
        console.error('Invalid image URL:', user.imageUrl);
        setProfileImageUrl(null);
      }
    } else {
      console.log('No user image URL found');
      setProfileImageUrl(null);
    }
  }, [user]);

  useEffect(() => {
    console.log('Profile image URL updated:', profileImageUrl);
  }, [profileImageUrl]);

  if (!isLoaded || !isSignedIn) {
    return <div className="flex items-center justify-center h-screen">Please sign in to view your profile.</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-48"></div>
        <div className="px-8 py-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="-mt-24 md:-mt-32">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Profile picture"
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-white shadow-lg"
                  unoptimized
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{user.fullName || 'User'}</h1>
              <p className="text-gray-600 mt-1">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
                {/* Add other user details here if needed */}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Account Stats</h2>
                <p className="mt-2 text-gray-600">Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                {/* Add more stats here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {['current', 'tried', 'wishlist'].map((shelfType) => (
          <section key={shelfType} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 capitalize">{shelfType} Shelf</h2>
            <ShelfGridPlaceholder shelfType={shelfType} />
          </section>
        ))}
      </div>
    </div>
  )
}

function ShelfGridPlaceholder({ shelfType }: { shelfType: string }) {
  interface MakeupProduct {
    id: string;
    name: string;
    brand: string;
    imageUrl: string;
  }

  const [products, setProducts] = useState<MakeupProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch makeup products for the shelf
    // This is a placeholder, replace with actual API call
    setLoading(false);
    setProducts([]); // Simulating empty list for now
  }, [shelfType]);

  if (loading) {
    return <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg">
        <Smile className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500 text-lg">No makeup products in your {shelfType} shelf yet</p>
        <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition duration-300">
          Add a product
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={192}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 truncate">{product.brand}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
