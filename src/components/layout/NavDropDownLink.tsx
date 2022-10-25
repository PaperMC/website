import clsx from "clsx";
import NextLink from "next/link";
import type { ReactElement, ReactNode } from "react";

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
      "color-gray-200 text-gray-800 hover:text-blue-600 text-sm transition-colors px-2.5 dark:(text-gray-200 hover:text-blue-400)",
      className
    )}
  >
    <NextLink
      href={href}
      passHref
      role="button"
      rel="noreferrer"
      target={target}
    >
      {children}
    </NextLink>
  </li>
);

export default NavDropDownLink;
