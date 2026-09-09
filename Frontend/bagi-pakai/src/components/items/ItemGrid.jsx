import React from 'react';
import { ItemCard } from './ItemCard';
import { CardSkeleton } from '../common/Loading';
import { EmptyState } from '../common/EmptyState';

export const ItemGrid = ({
  items = [],
  loading = false,
  emptyTitle = 'Belum Ada Barang',
  emptyDescription = 'Belum ada barang yang sesuai dengan filter atau kata kunci kamu.',
  emptyActionText,
  onEmptyAction,
  skeletonCount = 8,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
        className="my-8"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
