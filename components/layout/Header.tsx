import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          myShelf
        </Link>
        <Navigation />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
