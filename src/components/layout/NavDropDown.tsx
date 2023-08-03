import { Transition } from "@headlessui/react";
import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";
import { Fragment, useState } from "react";

import ChevronDownIcon from "@/assets/icons/heroicons/chevron-down.svg";

export interface NavDropDownProps {
  label: string;
  className?: string;
  children: ReactNode;
}

const NavDropDown = ({
  label,
  className,
  children,
}: NavDropDownProps): ReactElement => {
  const [hover, setHover] = useState(false);

  const handleEnter = () => {
    setHover(true);
  };

  const handleLeave = () => {
    setHover(false);
  };

  return (
    <div
      className={clsx(
        "color-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors px-2.5 relative inline-block h-full",
        className,
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="flex flex-row items-center gap-1" role="button">
        {label}
        <ChevronDownIcon className="w-4 h-4 fill-gray-700 dark:fill-gray-300" />
      </span>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-120 hidden"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={hover}
        unmount
      >
        <ul className="mt-2 flex flex-col py-1 z-100 bg-background-light-10 dark:bg-background-dark-90 transition-all md:(absolute border border-gray-200 dark:border-gray-800 rounded-lg shadow-md mt-0)">
          {children}
        </ul>
      </Transition>
    </div>
  );
};

export default NavDropDown;
