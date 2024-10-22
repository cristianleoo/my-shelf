'use client';

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  async function fetchProducts() {
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
  }

  function loadMore() {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product, index) => (
          <ProductCard 
            key={`${product.id}-${currentPage}-${index}`}
            product={{
              id: product.id,
              name: product.name,
              description: product.description || '',
              images: product.images,
            }}
          />
        ))}
      </div>
      {isLoading && <div>Loading more products...</div>}
      {currentPage < totalPages && !isLoading && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
    </div>
  )
}
