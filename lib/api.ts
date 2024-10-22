import { Product } from '@/types';

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/product/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
