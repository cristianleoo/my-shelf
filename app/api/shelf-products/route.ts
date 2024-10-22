import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ITEMS_PER_PAGE = 12 // Adjust this number as needed

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  try {
    let query = supabase.from('products').select('*', { count: 'exact' })

    // Filter products based on the type
    if (type === 'current') {
      query = query.eq('status', 'have')
    } else if (type === 'tried') {
      query = query.eq('status', 'had')
    } else if (type === 'wishlist') {
      query = query.eq('status', 'want')
    }

    const { data, error, count } = await query
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      products: data,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
