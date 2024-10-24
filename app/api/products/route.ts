import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const start = (page - 1) * limit

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(start, start + limit - 1)

  if (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const totalCount = count ?? 0;

  return NextResponse.json({
    products: data,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  })
}
