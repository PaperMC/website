import clsx from "clsx";
import type { ReactElement } from "react";

export interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps): ReactElement => (
  <div
    className={clsx(
      "rounded-md bg-gray-400/40 animate-pulse h-6 w-auto",
      className,
    )}
  />
);

export default Skeleton;
