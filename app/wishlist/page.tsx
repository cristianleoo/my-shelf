import ShelfGrid from '@/components/shelf/ShelfGrid'

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      <ShelfGrid shelfType="wishlist" />
    </div>
  )
}
