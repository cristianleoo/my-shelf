import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { action } = req.query

  switch (action) {
    case 'add':
      return handleAdd(req, res, userId)
    case 'edit':
      return handleEdit(req, res, userId)
    case 'delete':
      return handleDelete(req, res, userId)
    default:
      return res.status(400).json({ message: 'Invalid action' })
  }
}

async function handleAdd(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { product_id, rating, review_text } = req.body

  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id: userId, product_id, rating, review_text })

  if (error) {
    return res.status(500).json({ message: 'Error adding review', error })
  }

  res.status(201).json({ message: 'Review added successfully', data })
}

async function handleEdit(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id, rating, review_text } = req.body

  const { data, error } = await supabase
    .from('reviews')
    .update({ rating, review_text })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Error updating review', error })
  }

  res.status(200).json({ message: 'Review updated successfully', data })
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.body

  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Error deleting review', error })
  }

  res.status(200).json({ message: 'Review deleted successfully', data })
}
