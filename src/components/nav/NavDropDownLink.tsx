import { clsx } from "clsx";
import type { ReactNode } from "react";

export interface NavDropDownLinkProps {
    href: string;
    target?: string;
    className?: string;
    children: ReactNode;
    eol?: boolean;
}

const NavDropDownLink = ({
    href,
    target,
    className,
    children,
    eol,
}: NavDropDownLinkProps) => {
    return (
        <li
            className={clsx(
                "color-gray-200 text-gray-800 hover:text-blue-600 text-sm transition-colors dark:(text-gray-200 hover:text-blue-400)",
                eol && "hover:(text-red-600 dark:text-red-400)",
                className,
            )}
        >
            <a href={href} className={clsx(
                "px-4 py-2 w-full",
                eol ? "flex items-center gap-2" : "block",
            )}
                role="button"
                target={target}>
                {children}
            </a>
        </li>
    )
}

export default NavDropDownLink
