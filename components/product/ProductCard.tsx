'use client';

import Image from 'next/image'
import Link from 'next/link'
import { parseImages } from '@/lib/utils'
console.log('parseImages:', parseImages);

interface Product {
  id: string;
  name: string;
  actual_price: number;
  images: string;
  description: string; // Add this line
  // Add other properties as needed
}

interface ProductCardProps {
  product: Product;
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
    </Link>
  )
}
