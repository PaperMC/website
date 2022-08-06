import React, { ReactElement, ReactNode } from "react";
import NextLink from "next/link";
import clsx from "clsx";

export interface NavDropDownLinkProps {
  href: string;
  target?: string;
  className?: string;
  children: ReactNode;
}

const NavDropDownLink = ({
  href,
  target,
  className,
  children,
}: NavDropDownLinkProps): ReactElement => (
  <li
    className={clsx(
      "color-gray-200 text-gray-800 hover:text-blue-600 text-sm transition-colors px-2.5",
      className
    )}
  >
    <NextLink href={href} passHref>
      <a role="button" rel="noreferrer" target={target}>
        {children}
      </a>
    </NextLink>
  </li>
);

export default NavDropDownLink;
