import Logo from "assets/brand/logo.svg";
import DiscordIcon from "assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "assets/icons/fontawesome/github-brands.svg";
import TwitterIcon from "assets/icons/fontawesome/twitter-brands.svg";

import NextLink from "next/link";
import NavLink from "~/components/layout/NavLink";
import IconButton from "~/components/input/IconButton";
import { useEffect, useState } from "react";
import clsx from "clsx";

const NavBar = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScroll]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-shadow",
        scroll && "bg-background-light-10 shadow-xl"
      )}
    >
      <div className="max-w-7xl flex flex-row items-center mx-auto px-4 py-2 gap-2">
        <NextLink href="/">
          <Logo className="w-10 h-10 cursor-pointer" />
        </NextLink>
        <NextLink href="/" passHref>
          <a className="leading-0 mr-4">
            <span className="font-semibold text-lg">PaperMC</span>
          </a>
        </NextLink>
        {/* TODO: Responsive drawer */}
        <div className="md:block hidden">
          <NavLink href="/software">Software</NavLink>
          <NavLink href="https://forums.papermc.io/" target="_blank">
            Forums
          </NavLink>
          <NavLink href="/team">Team</NavLink>
        </div>
        <div className="flex-grow" />
        <IconButton
          icon={DiscordIcon}
          label="Discord"
          href="https://discord.gg/papermc"
          external
        />
        <IconButton
          icon={GitHubIcon}
          label="GitHub"
          href="https://github.com/PaperMC"
          external
        />
        <IconButton
          icon={TwitterIcon}
          label="Twitter"
          href="https://twitter.com/PaperPowered"
          external
        />
      </div>
    </nav>
  );
};

export default NavBar;
