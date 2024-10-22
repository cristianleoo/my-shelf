'use client';

import Image from 'next/image'
import Link from 'next/link'
import { parseImages } from '@/lib/utils'
console.log('parseImages:', parseImages);

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    images: any;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Link href={linkUrl} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={500}
            className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-75"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
      </div>
    </Link>
  )
}
