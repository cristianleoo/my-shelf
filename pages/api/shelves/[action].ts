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
    case 'create':
      return handleCreate(req, res, userId)
    case 'update':
      return handleUpdate(req, res, userId)
    case 'delete':
      return handleDelete(req, res, userId)
    default:
      return res.status(400).json({ message: 'Invalid action' })
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { name, description } = req.body

  const { data, error } = await supabase
    .from('shelves')
    .insert({ user_id: userId, name, description })

  if (error) {
    return res.status(500).json({ message: 'Error creating shelf', error })
  }

  res.status(201).json({ message: 'Shelf created successfully', data })
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id, name, description } = req.body

  const { data, error } = await supabase
    .from('shelves')
    .update({ name, description })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Error updating shelf', error })
  }

  res.status(200).json({ message: 'Shelf updated successfully', data })
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.body

  const { data, error } = await supabase
    .from('shelves')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    return res.status(500).json({ message: 'Error deleting shelf', error })
  }

  res.status(200).json({ message: 'Shelf deleted successfully', data })
}
