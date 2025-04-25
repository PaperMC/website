import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DelayedRenderProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

/**
 * Component that renders its children after a specified delay
 * Useful for showing terminal-like animations or delayed content
 */
const DelayedRender = ({ 
  children, 
  delay = 800, 
  fallback = null 
}: DelayedRenderProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return <>{show ? children : fallback}</>;
};

export default DelayedRender;