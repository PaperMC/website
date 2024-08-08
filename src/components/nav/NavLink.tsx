import { clsx } from "clsx";
import type { ReactNode } from "react";

export interface LinkProps {
    href: string;
    target?: string;
    className?: string;
    children: ReactNode;
}

const NavLink = ({ href, target, className, children }: LinkProps) => {
    return (
        <a href={href}
            rel="noreferrer"
            target={target}
            className={clsx(
                "color-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors px-2.5",
                className,
            )}>
            {children}
        </a>
    )
}

export default NavLink
