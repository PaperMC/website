import type { ReactElement } from "react";

export interface SegmentedControlsProps {
  selectedIndex: number;
  children: ReactElement[];
}

const SegmentedControls = ({
  selectedIndex,
  children,
}: SegmentedControlsProps): ReactElement => (
  <div className="p-1  bg-primary-200 rounded-lg">
    <div className="flex flex-row relative z-1">
      {children}

      <div
        className="-z-1 absolute left-0 inset-y-0 bg-primary-500 rounded-lg transition-all ease-in-out duration-100"
        style={{
          width: 100 / children.length + "%",
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
    </div>
  </div>
);

export default SegmentedControls;
