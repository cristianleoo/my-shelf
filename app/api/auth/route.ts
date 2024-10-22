import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  let clerkId;
  try {
    const body = await request.json();
    clerkId = body.clerkId;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  if (!clerkId) {
    return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 });
  }

  try {
    // Check if the user already exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, clerk_id')
      .eq('clerk_id', clerkId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }

    if (!existingUser) {
      // If user doesn't exist, create a new one
      const { data: createdUser, error: insertError } = await supabase
        .from('users')
        .insert({ clerk_id: clerkId })
        .select('id, clerk_id')
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
      }

      return NextResponse.json({ message: 'User created', user: createdUser });
    }

    return NextResponse.json({ message: 'User already exists', user: existingUser });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
