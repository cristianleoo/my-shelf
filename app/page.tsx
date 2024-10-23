import ProductGrid from '../components/product/ProductGrid'
import ShelfGrid from '../components/shelf/ShelfGrid'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800">Our Store</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Products</h2>
            <ProductGrid />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Shelves</h2>
            <ShelfGrid shelfType="current" />
          </section>
        </main>
        
        <footer className="bg-gray-800 text-white">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center">&copy; 2023 Our Store. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
