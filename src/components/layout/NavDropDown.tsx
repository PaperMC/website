import ChevronDownIcon from "assets/icons/heroicons/chevron-down.svg";

import { Fragment, ReactElement, ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";

export interface NavDropDownProps {
  label: string;
  children: ReactNode;
}

const NavDropDown = ({ label, children }: NavDropDownProps): ReactElement => {
  const [hover, setHover] = useState(false);

  const handleEnter = () => {
    setHover(true);
  };

  const handleLeave = () => {
    setHover(false);
  };

  return (
    <div
      className="color-gray-200 hover:text-blue-600 text-sm transition-colors px-2.5 relative inline-block h-full"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="flex flex-row items-center gap-1" role="button">
        {label}
        <ChevronDownIcon className="w-4 h-4 fill-gray-700" />
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
        <ul className="absolute top-full  flex flex-col z-50 p-2 gap-4 bg-background-light-10 border border-gray-200 rounded-lg shadow-md transition-all">
          {children}
        </ul>
      </Transition>
    </div>
  );
};

export default NavDropDown;
