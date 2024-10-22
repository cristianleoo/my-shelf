import ProductGrid from '../components/product/ProductGrid'
import ShelfGrid from '../components/shelf/ShelfGrid'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
          <ProductGrid />
        </section>
      </div>
    </ErrorBoundary>
  )
}
