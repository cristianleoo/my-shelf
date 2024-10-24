'use client'

import { Product } from '@/types'

export default function ProductDisplay({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      {/* Add more product details here */}
    </div>
  )
}
