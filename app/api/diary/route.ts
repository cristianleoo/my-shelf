import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('user_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching diary logs:', error);
    return NextResponse.json({ error: 'Error fetching diary logs' }, { status: 500 });
  }
}
