import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface LinkProps {
  href: string;
  target?: string;
  className?: string;
  children: ReactNode;
}

const NavLink = ({ href, target, className, children }: LinkProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  return (
    <Link
      href={href}
      rel="noreferrer"
      target={target}
      className={clsx(
        "color-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors px-2.5",
        isActive && "text-blue-400 font-bold",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
