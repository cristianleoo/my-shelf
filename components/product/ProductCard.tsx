'use client';

import Image from 'next/image'
import Link from 'next/link'
import { parseImages } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useUserStore } from '@/lib/userStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    images: string; // Changed from 'any' to 'string'
    actual_price: number;
    is_in_current_shelf?: boolean;
  };
  onAddToShelf: () => Promise<void>;
}

export default function ProductCard({ product, onAddToShelf }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { user } = useUser()
  const { supabaseUserId } = useUserStore()
  const router = useRouter()

  if (!product) return null; // Move the guard clause after the hooks

  const addToShelf = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (!user || !supabaseUserId) {
      toast.error('Please sign in to add products to your shelf')
      return
    }

    setIsAdding(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_in_current_shelf: true })
        .eq('id', product.id)

      if (error) throw error

      toast.success('Product added to your shelf!')
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('productAddedToShelf'))
      
      // Refresh the current route
      router.refresh()
    } catch (error) {
      console.error('Error adding product to shelf:', error)
      if (error instanceof Error) {
        toast.error(`Failed to add product to shelf: ${error.message}`)
      } else {
        toast.error('Failed to add product to shelf: Unknown error')
      }
    } finally {
      setIsAdding(false)
    }
  }

  let images: string[] = [];
  try {
    images = parseImages(product.images);
  } catch (error) {
    console.error('Error parsing images:', error);
  }
  
  const imageUrl = images.length > 0 ? images[0] : '/placeholder-image.jpg';
  const title = product.name;
  const linkUrl = `/product/${product.id}`;

  return (
    <Link href={linkUrl} className="group" key={product.id}>
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={500}
            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white mb-1 truncate">{title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">{product.description}</p>
          </div>
        </div>
      </div>
      <motion.button
        onClick={addToShelf}
        disabled={isAdding || product.is_in_current_shelf}
        className={`
          mt-4 w-full py-2 px-4 rounded-full font-medium text-sm
          transition-all duration-300 ease-in-out
          ${product.is_in_current_shelf 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
        whileTap={{ scale: 0.95 }}
      >
        {isAdding ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : product.is_in_current_shelf ? (
          <span className="flex items-center justify-center">
            <CheckIcon className="w-4 h-4 mr-2" />
            In Your Shelf
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add to Shelf
          </span>
        )}
      </motion.button>
    </Link>
  )
}
