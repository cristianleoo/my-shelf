'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface ProductDetailsProps {
  description: string
}

export default function ProductDetails({ description }: ProductDetailsProps) {
  const [expanded, setExpanded] = useState(false)

  const truncatedDescription = description.slice(0, 200) + (description.length > 200 ? '...' : '')

  return (
    <div>
      <p className="text-gray-700 mb-4">
        {expanded ? description : truncatedDescription}
      </p>
      {description.length > 200 && (
        <Button 
          variant="outline" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </div>
  )
}
