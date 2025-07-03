import type { HTMLAttributes } from "react";

const SegmentedControlItem = (props: HTMLAttributes<HTMLButtonElement>) => (
  <button className="flex-1 text-sm font-semibold py-2" {...props} />
);

export default SegmentedControlItem;
