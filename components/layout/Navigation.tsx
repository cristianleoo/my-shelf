import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-gray-600 hover:text-purple-600">
            Home
          </Link>
        </li>
        <li>
          <Link href="/profile" className="text-gray-600 hover:text-purple-600">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/wishlist" className="text-gray-600 hover:text-purple-600">
            Wishlist
          </Link>
        </li>
      </ul>
    </nav>
  )
}
