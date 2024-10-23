import { useState, useEffect } from 'react'
import { useUserStore } from '@/lib/userStore'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string;
  name: string;
  actual_price: number;
  images: string;
  description: string;
}

interface ShelfItem {
  product_id: string;
  products: Product;
}

export default function MyShelf() {
  const [shelfProducts, setShelfProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { supabaseUserId } = useUserStore()

  const fetchShelfProducts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('user_shelves')
      .select('product_id, products(*)')
      .eq('user_id', supabaseUserId)

    if (error) {
      console.error('Error fetching shelf products:', error)
    } else {
      setShelfProducts(data.map((item: { product_id: string; products: Product[] }) => ({
        ...item.products[0],
        images: Array.isArray(item.products[0].images) ? item.products[0].images[0] : item.products[0].images
      })))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchShelfProducts()

    // Add event listener for custom event
    window.addEventListener('productAddedToShelf', fetchShelfProducts)

    // Cleanup function
    return () => {
      window.removeEventListener('productAddedToShelf', fetchShelfProducts)
    }
  }, [supabaseUserId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {shelfProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
