'use client';

import ShelfCard from './ShelfCard'
import { Product } from '@/types'
import { useEffect, useState } from 'react'

// Update the Product type or create a new interface
interface ShelfProduct extends Product {
  status: 'have' | 'had' | 'want';
}

interface ShelfGridProps {
  shelfType: 'current' | 'tried' | 'wishlist'
}

export default function ShelfGrid({ shelfType }: ShelfGridProps) {
  const [products, setProducts] = useState<ShelfProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shelf-products?type=${shelfType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [shelfType]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ShelfCard key={product.id} product={product} status={product.status} />
      ))}
    </div>
  )
}
