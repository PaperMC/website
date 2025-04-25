import React, { ReactElement } from 'react';
import Skeleton from './Skeleton';

interface LoadingStatsProps {
  width?: string;
  height?: string;
  isLoading: boolean;
  error?: Error;
  children: ReactElement | string;
  retryFn?: () => void;
}

/**
 * A component that displays a loading skeleton or error state for statistics
 */
const LoadingStats = ({
  width = 'w-20',
  height = 'h-6',
  isLoading,
  error,
  children,
  retryFn
}: LoadingStatsProps): ReactElement => {
  if (isLoading) {
    return <Skeleton className={`${width} ${height} inline-block align-middle rounded`} />;
  }

  if (error) {
    return (
      <div className="inline-flex items-center">
        <span className="text-red-500 mr-2">Error loading data</span>
        {retryFn && (
          <button 
            onClick={retryFn} 
            className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-200 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return children as ReactElement;
};

export default LoadingStats;