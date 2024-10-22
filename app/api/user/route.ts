import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const clerkId = request.nextUrl.searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 });
  }

  console.log('Fetching user for Clerk ID:', clerkId);

  try {
    // Try to fetch the user
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    console.log('Supabase query result:', { user, error });

    // If user doesn't exist, create a new one
    if (error && error.code === 'PGRST116') {
      console.log('User not found, creating new user');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ clerk_id: clerkId })
        .select('id')
        .single();

      console.log('New user creation result:', { newUser, createError });

      if (createError) {
        console.error('Error creating new user:', createError);
        throw createError;
      }
      if (!newUser) {
        console.error('Failed to create user');
        throw new Error('Failed to create user');
      }
      return NextResponse.json({ supabaseUserId: newUser.id });
    } else if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    return NextResponse.json({ supabaseUserId: user.id });
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
