'use client';

import { useEffect, useState, useCallback } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/shelf-products?type=want&page=${currentPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      if (!data.products || data.products.length === 0) {
        throw new Error('No products found')
      }
      setProducts(prevProducts => [...prevProducts, ...data.products])
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function loadMore() {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  async function handleAddToShelf(productId: string) {
    try {
      const response = await fetch('/api/add-to-shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (!response.ok) throw new Error('Failed to add to shelf')
      // Optionally, update UI or show a success message
    } catch (error) {
      console.error('Error adding to shelf:', error)
      // Optionally, show an error message to the user
    }
  }

  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <ProductCard 
            key={`${product.id}-${currentPage}-${index}`}
            product={{
              id: product.id,
              name: product.name,
              description: product.description || '',
              images: Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : ''),
              actual_price: product.actual_price,
            }}
            onAddToShelf={() => handleAddToShelf(product.id)}
          />
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {currentPage < totalPages && !isLoading && (
        <div className="mt-12 text-center">
          <Button 
            onClick={loadMore}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
