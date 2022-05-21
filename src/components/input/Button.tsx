import { ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";

export interface ButtonProps {
  variant: "outlined" | "filled";
  href?: string;
  external?: boolean;
  children: ReactNode;
}

const Button = ({ variant, href, external, children }: ButtonProps) => {
  const button = (
    <button
      className={clsx(
        "font-medium px-6 py-1.5 text-sm rounded-md hover:shadow-md transition-shadow",
        variant === "outlined"
          ? "border-1 border-gray-400"
          : "bg-blue-500 text-white"
      )}
    >
      {children}
    </button>
  );

  if (href) {
    return (
      <Link
        href={href}
        rel="noreferrer"
        target={external ? "_blank" : "_self"}
        passHref
      >
        {button}
      </Link>
    );
  }

  return button;
};

export default Button;
