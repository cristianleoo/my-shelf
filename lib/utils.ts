import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseImages(images: unknown): string[] {
  if (!images) return [];
  
  if (typeof images === 'string') {
    try {
      // Try parsing as JSON
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((url): url is string => typeof url === 'string' && url.startsWith('http'));
      }
    } catch (e) {
      // If parsing fails, split by comma
      return images.split(',').map(url => url.trim()).filter((url): url is string => url.startsWith('http'));
    }
  }
  
  if (Array.isArray(images)) {
    return images.filter((url): url is string => typeof url === 'string' && url.startsWith('http'));
  }
  
  if (typeof images === 'object' && images !== null) {
    // If it's an object, try to extract URLs from its values
    return Object.values(images)
      .filter((value): value is string => typeof value === 'string' && value.startsWith('http'));
  }
  
  return [];
}
