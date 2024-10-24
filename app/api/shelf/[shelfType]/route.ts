import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { shelfType: string } }
) {
  const shelfType = params.shelfType;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('shelf_products')
      .select('products(*)');

    // Adjust the query based on shelfType
    switch (shelfType) {
      case 'current':
        query = query.eq('status', 'have');
        break;
      case 'tried':
        query = query.eq('status', 'had');
        break;
      case 'wishlist':
        query = query.eq('status', 'want');
        break;
      default:
        return NextResponse.json({ error: 'Invalid shelf type' }, { status: 400 });
    }

    const { data, error } = await query.eq('user_id', user.id);

    if (error) throw error;
    // Extract products from the nested structure
    const products = data.map((item: { products: unknown }) => item.products);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
