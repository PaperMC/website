import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ButtonProps {
  variant: "outlined" | "filled";
  dense?: boolean;
  href: string;
  external?: boolean;
  children: ReactNode;
}

const Button = ({ variant, dense, href, external, children }: ButtonProps) => (
  <Link
    role="button"
    className={clsx(
      "font-medium px-6 py-1.5 rounded-md hover:shadow-md transition-shadow",
      dense ? "text-sm" : "text-md",
      variant === "outlined"
        ? "border-1 border-gray-400 dark:border-gray-600"
        : "bg-blue-600 text-white"
    )}
    rel="noreferrer"
    target={external ? "_blank" : "_self"}
    href={href}
  >
    {children}
  </Link>
);

export default Button;
