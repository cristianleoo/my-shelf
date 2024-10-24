import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description } = await request.json()

  const { data, error } = await supabase
    .from('shelves')
    .insert({ user_id: userId, name, description })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const userId = request.nextUrl.searchParams.get('userId') || user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized or User ID is required' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('shelves')
      .select('id, name')
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching shelves:', error);
    return NextResponse.json({ error: 'Error fetching shelves' }, { status: 500 });
  }
}
