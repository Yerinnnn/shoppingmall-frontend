import React from 'react';
import WishlistItem from './WishlistItem';
import WishlistSkeleton from './WishlistSkeleton';
import EmptyWishlist from './EmptyWishlist';
import { WishlistItem as WishlistItemType } from '../../types/wishlist';

interface WishlistListProps {
  items: WishlistItemType[];
  isLoading: boolean;
  onRemove: (wishlistId: number) => void;
}

const WishlistList: React.FC<WishlistListProps> = ({
  items,
  isLoading,
  onRemove
}) => {
  if (isLoading) {
    return <WishlistSkeleton />;
  }

  if (!items.length) {
    return <EmptyWishlist />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WishlistItem
          key={item.wishlistId}
          item={item}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default WishlistList;