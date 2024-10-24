import React from 'react';

interface Shelf {
  id: number;
  name: string;
  // Add other relevant properties
}

interface UserShelvesProps {
  shelves: Shelf[] | null | undefined;
}

const UserShelves: React.FC<UserShelvesProps> = ({ shelves }) => {
  if (!shelves || !Array.isArray(shelves)) {
    return <div>No shelves available</div>;
  }

  return (
    <div>
      {shelves.map((shelf, index) => (
        <div key={shelf.id || index}>{shelf.name}</div>
      ))}
    </div>
  );
};

export default UserShelves;
