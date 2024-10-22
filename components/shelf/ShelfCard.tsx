import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

interface ShelfCardProps {
  product: Product
  status: 'have' | 'had' | 'want'
}

export default function ShelfCard({ product, status }: ShelfCardProps) {
  return (
    <div className="relative group">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={product.images[0]} // Assuming the first image in the array is the main image
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
            width={300}
            height={300}
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{product.brand}</p>
      </Link>
      <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
        {status === 'have' && 'I have it'}
        {status === 'had' && 'I had it'}
        {status === 'want' && 'I want it'}
      </div>
    </div>
  )
}
