import type { HTMLAttributes, ReactElement } from "react";

const SegmentedControlItem = (
  props: HTMLAttributes<HTMLButtonElement>,
): ReactElement => (
  <button className="flex-1 text-sm font-semibold py-2" {...props} />
);

export default SegmentedControlItem;
