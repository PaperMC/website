import type { FunctionComponent } from "react";

export interface IconButtonProps {
  icon: string;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => {
  const { icon, label, href, onClick } = props;

  if (href) {
    return (
      <a
        href={href}
        rel="noreferrer"
        target="_blank"
        className="inline-block h-min w-min rounded-full p-2 transition-colors hover:bg-gray-800/20 dark:hover:bg-gray-400/20 leading-0"
        onClick={onClick}
        aria-label={label}
      >
        <img src={icon} className="h-6 w-6 fill-gray-700 dark:fill-gray-300" />
      </a>
    );
  }

  return (
    <button
      className="h-min w-min rounded-full p-2 transition-colors hover:bg-gray-800/20"
      onClick={onClick}
      aria-label={label}
    >
      <img src={icon} className="h-6 w-6 gray-700" />
    </button>
  );
};

export default IconButton;
