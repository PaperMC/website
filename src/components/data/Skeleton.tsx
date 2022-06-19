import { ReactElement } from "react";
import clsx from "clsx";

export interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps): ReactElement => (
  <div className={clsx("rounded-md bg-gray-200/40 animate-pulse h-6 w-auto", className)} />
);

export default Skeleton;
