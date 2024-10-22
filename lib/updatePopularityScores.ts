import { createClient } from '@supabase/supabase-js'

export async function updatePopularityScores() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all products with their associated data
  const { data: products, error } = await supabase
    .from('products')
    .select('id, rating, status')

  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  // Update popularity scores
  for (const product of products) {
    let popularityScore = 0

    // Factor in rating
    popularityScore += product.rating.average * 10

    // Factor in status (more 'have' and 'had' increase popularity)
    if (product.status === 'have') popularityScore += 20
    if (product.status === 'had') popularityScore += 10

    // Update the product's popularity score
    const { error: updateError } = await supabase
      .from('products')
      .update({ popularity_score: popularityScore })
      .eq('id', product.id)

    if (updateError) {
      console.error(`Error updating popularity score for product ${product.id}:`, updateError)
    }
  }

  console.log('Popularity scores updated successfully')
}
