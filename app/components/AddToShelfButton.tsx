import { useState, useEffect } from 'react';

const AddToShelfButton = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [shelfId, setShelfId] = useState<string | null>(null);

  const addToShelf = async (productId: string, shelfId: string) => {
    try {
      const response = await fetch('/api/shelf/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ productId, shelfId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product to shelf');
      }

      const data = await response.json();
      // Handle successful addition...
    } catch (error) {
      console.error('Error adding product to shelf:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <button onClick={() => addToShelf(productId!, shelfId!)}>
      Add to Shelf
    </button>
  );
};

export default AddToShelfButton;
