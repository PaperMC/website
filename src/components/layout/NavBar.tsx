import clsx from "clsx";
import { NextComponentType, NextPageContext } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Logo from "@/assets/brand/logo.svg";
import DiscordIcon from "@/assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "@/assets/icons/fontawesome/github-brands.svg";
import TwitterIcon from "@/assets/icons/fontawesome/twitter-brands.svg";
import ExternalUrlIcon from "@/assets/icons/heroicons/arrow-top-right-on-square.svg";
import MenuIcon from "@/assets/icons/heroicons/menu.svg";
import IconButton from "@/components/input/IconButton";
import NavDropDown from "@/components/layout/NavDropDown";
import NavDropDownLink from "@/components/layout/NavDropDownLink";
import NavLink from "@/components/layout/NavLink";
import { PageSoftwareProps } from "@/lib/util/types";

export interface NavBarProps {
  component: NextComponentType<NextPageContext, any, any>;
}

const NavBar = ({ component }: NavBarProps) => {
  const [scroll, setScroll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const softwareProps: PageSoftwareProps | undefined = (component as any)[
    "softwareProps"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScroll]);

  useEffect(() => {
    setShowMenu(false);
  }, [router.route]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-shadow",
        scroll && "bg-background-light-10 dark:bg-background-dark-90 shadow-xl"
      )}
    >
      <div className="max-w-7xl flex flex-row items-center mx-auto px-4 py-2 gap-2">
        <button
          className="leading-0 mr-2 md:hidden"
          onClick={() => setShowMenu((show) => !show)}
        >
          <MenuIcon className="w-6 h-6 fill-gray-500" />
        </button>
        <NextLink href="/" passHref>
          <a className="leading-0" tabIndex={-1} aria-hidden={true}>
            <Logo className="w-10 h-10 cursor-pointer" />
          </a>
        </NextLink>
        <NextLink href="/" passHref>
          <a className="leading-0 mr-4">
            <span className="font-semibold text-lg">PaperMC</span>
          </a>
        </NextLink>
        <div
          className={clsx(
            "absolute top-full left-0 right-0 flex flex-col bg-background-light-10 dark:bg-background-dark-90 gap-4 p-4 shadow-xl w-full md:(block relative w-auto shadow-none bg-transparent p-0)",
            !showMenu && "hidden"
          )}
        >
          <NavDropDown label="Software">
            <NavDropDownLink href="/software/paper">Paper</NavDropDownLink>
            <NavDropDownLink href="/software/velocity">
              Velocity
            </NavDropDownLink>
            <NavDropDownLink href="/software/waterfall">
              Waterfall
            </NavDropDownLink>
          </NavDropDown>
          <NavLink href="https://forums.papermc.io/" target="_blank">
            Forums
            <ExternalUrlIcon className="h-4 w-4 ml-1 align-sub" />
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
          href={softwareProps?.github || "https://github.com/PaperMC"}
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
