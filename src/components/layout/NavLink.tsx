import clsx from "clsx";
import NextLink from "next/link";
import type { ReactNode } from "react";

export interface LinkProps {
  href: string;
  target?: string;
  className?: string;
  children: ReactNode;
}

const NavLink = ({ href, target, className, children }: LinkProps) => (
  <NextLink href={href} passHref>
    <a
      target={target}
      className={clsx(
        "color-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors px-2.5",
        className,
      )}
    >
      {children}
    </a>
  </NextLink>
);

export default NavLink;
