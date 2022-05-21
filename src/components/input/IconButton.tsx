import Link from "next/link";
import { FunctionComponent } from "react";

export interface IconButtonProps {
  icon: FunctionComponent<any>;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => {
  const { icon: Icon, label, href, external, onClick } = props;

  if (href) {
    const anchor = (
      <a
        href={href}
        rel="noreferrer"
        target="_blank"
        className="inline-block h-min w-min rounded-full p-2 transition-colors hover:bg-gray-800/20 leading-0"
        onClick={onClick}
        aria-label={label}
      >
        <Icon className="h-6 w-6 fill-gray-700" />
      </a>
    );

    if (external) {
      return anchor;
    } else {
      return (
        <Link className="gray-700" href={href} passHref>
          {anchor}
        </Link>
      );
    }
  }

  return (
    <button
      className="h-min w-min rounded-full p-2 transition-colors hover:bg-gray-800/20"
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-6 w-6 gray-700" />
    </button>
  );
};

export default IconButton;
