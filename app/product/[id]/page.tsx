import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { parseImages } from '@/lib/utils'
import ProductImage from '@/components/ProductImage'

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
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {images.length > 0 ? (
                <ProductImage
                  src={images[0]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 w-full h-[500px] flex items-center justify-center rounded-lg">
                  <p>No image available</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-lg mb-4">{product.description}</p>
              <p className="text-xl font-bold mb-4">${product.actual_price}</p>
              <Button>Add to Cart</Button>
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
