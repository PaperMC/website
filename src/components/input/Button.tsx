import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ButtonProps {
  variant: "outlined" | "filled";
  dense?: boolean;
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

const Button = ({
  variant,
  dense,
  href,
  external,
  className,
  children,
}: ButtonProps) => (
  <Link
    role="button"
    className={clsx(
      "font-medium px-6 py-1.5 rounded-md hover:shadow-md transition",
      dense ? "text-sm" : "text-md",
      variant === "outlined"
        ? "border-1 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        : "bg-blue-600 hover:bg-blue-500 text-white",
      className,
    )}
    rel="noreferrer"
    target={external ? "_blank" : "_self"}
    href={href}
  >
    {children}
  </Link>
);

export default Button;
