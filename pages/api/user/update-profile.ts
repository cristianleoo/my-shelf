import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { name, avatar_url } = req.body

  const { data, error } = await supabase
    .from('users')
    .update({ name, avatar_url })
    .eq('clerk_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Error updating profile', error })
  }

  res.status(200).json({ message: 'Profile updated successfully', data })
}
