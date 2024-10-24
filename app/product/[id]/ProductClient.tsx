import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  // Add other product properties as needed
}

interface Shelf {
  id: string;
  name: string;
}

export default function ProductClient({ product }: { product: Product }) {
  const { user } = useUser();
  const [productStatus, setProductStatus] = useState('');
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [selectedShelf, setSelectedShelf] = useState('');

  // Fetch user's shelves when component mounts
  useEffect(() => {
    if (user) {
      fetchShelves();
    }
  }, [user]);

  const fetchShelves = async () => {
    const response = await fetch('/api/shelves');
    const data = await response.json();
    setShelves(data);
  };

  const addToShelf = async () => {
    if (!selectedShelf) {
      toast.error('Please select a shelf');
      return;
    }

    try {
      const response = await fetch('/api/shelf/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          shelfId: selectedShelf,
        }),
      });

      if (response.ok) {
        toast.success('Product added to shelf');
      } else {
        throw new Error('Failed to add product to shelf');
      }
    } catch (error) {
      toast.error('Error adding product to shelf');
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Other product details */}
      
      <select
        value={selectedShelf}
        onChange={(e) => setSelectedShelf(e.target.value)}
      >
        <option value="">Select a shelf</option>
        {shelves.map((shelf) => (
          <option key={shelf.id} value={shelf.id}>
            {shelf.name}
          </option>
        ))}
      </select>
      
      <Button onClick={addToShelf}>Add to Shelf</Button>
    </div>
  );
}
