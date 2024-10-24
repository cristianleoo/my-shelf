import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { productId, shelfId } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Supabase getUser error:', error);
      return NextResponse.json({ error: 'Authentication error', details: error }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { data: insertData, error: insertError } = await supabase
      .from('shelf_products')
      .insert({
        shelf_id: shelfId,
        product_id: productId,
        added_at: new Date().toISOString(),
      })
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to add product to shelf', details: insertError }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertData });
  } catch (error) {
    console.error('Unexpected error in add-product route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred', details: error }, { status: 500 });
  }
}
