import React, { ReactElement } from 'react';

export interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps): ReactElement => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className || ''}`}
    aria-hidden="true"
  />
);

export default Skeleton;