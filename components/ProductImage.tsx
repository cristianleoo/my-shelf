'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function ProductImage({ src, alt, width, height, className }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc('/placeholder-image.jpg')}
    />
  )
}
