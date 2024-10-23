import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { parseImages } from '@/lib/utils'
import ProductImage from '@/components/ProductImage'
import ProductDetails from '@/components/ProductDetails'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Use inline typing for the component props
export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  const images = parseImages(product.images);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-100 p-8">
              {images.length > 0 ? (
                <ProductImage
                  src={images[0]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-auto object-cover"
                />
              ) : (
                <div className="bg-gray-200 w-full h-[500px] flex items-center justify-center rounded-lg">
                  <p>No image available</p>
                </div>
              )}
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold mb-6">€{product.actual_price}</p>
              <ProductDetails description={product.description} />
              <div className="mt-8">
                <Button size="lg" className="w-full">Add to Cart</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single()

  return {
    title: product?.name || 'Product Not Found',
    description: product?.description || 'No description available',
  }
}
