export interface Product {
  id: string;
  name: string;
  description?: string;
  images: any; // This can be a string, array, or object
  actual_price: number;
  url?: string | null;
  sku: string;
  in_stock: boolean;
  regular_price: number;
  unit_price: number;
  value_price: number;
  currency: string;
  brand: string;
  videos: string[];
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  loyalty_points: number;
  delivery_options: string[];
  breadcrumbs: string[];
  promotions_eligible: boolean;
  variants: any[]; // You might want to define a more specific type for variants
  tips: string;
  more_information: string;
  ingredients: string;
  notes: string;
  recommendation_products: string[];
  product_sku_name: string;
  status: 'have' | 'had' | 'want';
  popularity_score: number;
  created_at: string;
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  content: string
  createdAt: string
}

