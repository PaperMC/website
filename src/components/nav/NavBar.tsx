import { clsx } from "clsx";
import { useEffect, useState } from "react";

import IconButton from '@/components/IconButton';
import NavDropDown from '@/components/nav/NavDropDown';
import NavDropDownLink from '@/components/nav/NavDropDownLink';
import NavLink from '@/components/nav/NavLink';

import LogoMarkerDark from "@/assets/brand/logo-marker-dark.svg";
import LogoMarkerLight from "@/assets/brand/logo-marker-light.svg";
import DiscordIcon from "@/assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "@/assets/icons/fontawesome/github-brands.svg";
import TwitterIcon from "@/assets/icons/fontawesome/twitter-brands.svg";
import ExternalUrlIcon from "@/assets/icons/heroicons/arrow-top-right-on-square.svg";
import MenuIcon from "@/assets/icons/heroicons/menu.svg";

const NavBar = () => {
    const [scroll, setScroll] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

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
                scroll && "bg-background-light-10 dark:bg-background-dark-90 shadow-xl",
            )}
        >
            <div className='max-w-7xl flex flex-row items-center mx-auto px-4 py-2 gap-2'>
                <button
                    title={"Toggle nav"}
                    className="leading-0 mr-2 md:hidden"
                    onClick={() => setShowMenu((show) => !show)}
                >
                    <img src={MenuIcon.src} alt="Menu" className="w-6 h-6 fill-gray-500" />
                </button>
                <a href='/' className="leading-0" tabIndex={-1} aria-hidden={true}>
                    <img src={LogoMarkerLight.src} alt="PaperMC" className="block dark:hidden h-12 cursor-pointer" />
                    <img src={LogoMarkerDark.src} alt="PaperMC" className="hidden dark:block h-12 cursor-pointer" />
                </a>
                <div className={clsx(
                    "absolute top-full left-0 right-0 flex flex-col bg-background-light-10 dark:bg-background-dark-90 gap-4 p-4 shadow-xl w-full md:(block relative w-auto shadow-none bg-transparent p-0)",
                    !showMenu && "hidden",
                )}>
                    <NavDropDown label='Software'>
                        <NavDropDownLink href="/software/paper">Paper</NavDropDownLink>
                        <NavDropDownLink href="/software/folia">Folia</NavDropDownLink>
                        <NavDropDownLink href="/software/velocity">
                            Velocity
                        </NavDropDownLink>
                        <NavDropDownLink href="/software/waterfall" eol>
                            Waterfall
                        </NavDropDownLink>
                    </NavDropDown>
                    <NavLink
                        href="https://hangar.papermc.io/"
                        target="_blank"
                        className="inline-flex items-center"
                    >
                        Plugins
                        <img src={ExternalUrlIcon.src} className="h-4 w-4 ml-1 align-sub" />
                    </NavLink>
                    <NavLink
                        href="https://docs.papermc.io/"
                        target="_blank"
                        className="inline-flex items-center"
                    >
                        Docs
                        <img src={ExternalUrlIcon.src} className="h-4 w-4 ml-1 align-sub" />
                    </NavLink>
                    <NavLink
                        href="https://forums.papermc.io/"
                        target="_blank"
                        className="inline-flex items-center"
                    >
                        Forums
                        <img src={ExternalUrlIcon.src} className="h-4 w-4 ml-1 align-sub" />
                    </NavLink>
                    <NavLink href="/team">Team</NavLink>
                    <NavLink href="/contribute">Contribute</NavLink>
                </div>
            </div>

            <div className='flex-grow'>
                <IconButton
                    icon={DiscordIcon.src}
                    label="Discord"
                    href="https://discord.gg/papermc"
                    external
                />
                <IconButton
                    icon={GitHubIcon.src}
                    label="GitHub"
                    href={"https://github.com/PaperMC"}
                    external
                />
                <IconButton
                    icon={TwitterIcon.src}
                    label="Twitter"
                    href="https://twitter.com/PaperPowered"
                    external
                />
            </div>
        </nav>
    )
}

export default NavBar