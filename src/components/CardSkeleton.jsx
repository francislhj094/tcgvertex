import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Image Skeleton */}
      <div className="skeleton" style={{ width: '100%', aspectRatio: '2.5/3.5', borderRadius: 'var(--radius-md)' }}></div>
      
      {/* Text Skeleton */}
      <div>
        <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '8px' }}></div>
        <div className="flex-between">
          <div className="skeleton" style={{ height: '24px', width: '40%' }}></div>
          <div className="skeleton" style={{ height: '16px', width: '20%' }}></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="skeleton" style={{ height: '48px', width: '100%', borderRadius: 'var(--radius-md)' }}></div>
    </div>
  );
};

export default CardSkeleton;
