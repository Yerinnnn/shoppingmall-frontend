import React from "react";
import { WishlistItem } from "../types";
import WishlistItemCard from "./WishlistItem";
import WishlistSkeleton from "./skeletons/WishlistSkeleton";
import EmptyWishlist from "./EmptyWishlist";

interface WishlistListProps {
  items: WishlistItem[];
  isLoading: boolean;
  onRemove: (wishlistId: number) => Promise<void>;
}

const WishlistList: React.FC<WishlistListProps> = ({
  items,
  isLoading,
  onRemove,
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
        <WishlistItemCard
          key={item.wishlistId}
          item={item}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default WishlistList;
