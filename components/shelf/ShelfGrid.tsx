'use client';

import ShelfCard from './ShelfCard'
import { Product } from '@/types'
import { useState, useEffect } from 'react'

// Update the Product type or create a new interface
interface ShelfProduct extends Product {
  status: 'have' | 'had' | 'want';
}

interface ShelfGridProps {
  shelfType: 'current' | 'tried' | 'wishlist'
}

export default function ShelfGrid({ shelfType }: ShelfGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shelf/${shelfType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Received non-array data:', data);
          setError('Received invalid data format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [shelfType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ShelfCard key={product.id} product={product} status={product.status} />
      ))}
    </div>
  )
}
