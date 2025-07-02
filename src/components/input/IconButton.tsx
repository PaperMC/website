import Link from "next/link";

import DiscordIcon from "@/assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "@/assets/icons/fontawesome/github-brands.svg";
import TwitterIcon from "@/assets/icons/fontawesome/twitter-brands.svg";

const ICONS = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
} as const;

export interface IconButtonProps {
  iconId: keyof typeof ICONS;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => {
  const { iconId, label, href, onClick } = props;
  const Icon = ICONS[iconId];

  if (href) {
    return (
      <Link
        href={href}
        rel="noreferrer"
        target="_blank"
        className="inline-block h-fit w-fit rounded-full p-2 transition-colors hover:bg-gray-800/20 dark:hover:bg-gray-400/20 leading-none"
        onClick={onClick}
        aria-label={label}
      >
        <Icon className="h-6 w-6 fill-gray-700 dark:fill-gray-300" />
      </Link>
    );
  }

  return (
    <button
      className="h-fit w-fit rounded-full p-2 transition-colors hover:bg-gray-800/20"
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-6 w-6 gray-700" />
    </button>
  );
};

export default IconButton;
