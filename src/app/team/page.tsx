import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import teams from "@/assets/data/team.json";
import DiscordIcon from "@/assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "@/assets/icons/fontawesome/github-brands.svg";
import Button from "@/components/input/Button";
import { fetchContributors } from "@/lib/service/github";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the team behind PaperMC, a Minecraft software organization focusing on improving the game's ecosystem with faster and more secure software.",
  keywords: ["papermc", "paper", "minecraft", "team"],
};

const HIDDEN_USERS = new Set([1007849, 23557539, 49699333]);

export default async function TeamPage() {
  const contributors = await fetchContributors();

  return (
    <>
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:pt-28 lg:pb-16 gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">Meet our team</h1>
          <p className="text-xl mt-4">
            Meet the members behind PaperMC, a Minecraft software organization focusing on improving the game&apos;s
            ecosystem with faster and more secure software.
          </p>

          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="/sponsors">
              Sponsor
            </Button>
            <Button variant="outlined" href="https://github.com/PaperMC" external>
              GitHub
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end" />
      </header>

      {teams.map((team) => (
        <section id={team.id} key={team.id} className="px-4 py-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-medium mb-2">{team.name}</h2>
          <p>{team.description}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {team.members.map((member: { name: string; github?: string; discord?: string; avatar?: string }) => (
              <article
                key={member.name}
                className="border border-gray-300 dark:border-gray-700 rounded-md hover:shadow-md transition-shadow p-4"
              >
                <div className="flex flex-row gap-6">
                  <div className="w-20 h-20 relative bg-gray-600 rounded-md overflow-clip">
                    {member.avatar && (
                      <Image
                        alt={`${member.name}'s avatar`}
                        src={member.avatar}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 break-all">
                    <span className="font-semibold">{member.name}</span>

                    {member.github && (
                      <Link
                        href={`https://github.com/${member.github}`}
                        className="flex flex-row items-center gap-2 mt-2 text-blue-800 dark:text-blue-300 text-sm font-medium"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <GitHubIcon className="w-4 h-4 fill-gray-700 dark:fill-gray-300" />
                        {member.github}
                      </Link>
                    )}

                    {member.discord && (
                      <div className="flex flex-row items-center gap-2 mt-1 text-blue-800 dark:text-blue-300 text-sm font-medium">
                        <DiscordIcon className="w-4 h-4 fill-gray-700 dark:fill-gray-300" />
                        {member.discord}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section id="contributors" className="px-4 py-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-medium mb-2">Contributors</h2>
        <p>
          Contributors are those people who have helped the organization by making important contributions to our
          codebases. From adding a new redstone engine to PRing a fix for a nasty bug, our contributors have helped us
          to provide the best software we possibly can.
        </p>

        {contributors.length === 0 ? (
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-amber-800 dark:text-amber-200">
              Unable to load contributors at this time (e.g., GitHub API rate limiting). Please try again later or visit{" "}
              <Link
                href="https://github.com/PaperMC/Paper/graphs/contributors"
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub contributors
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 mt-8 gap-2">
            {contributors
              .filter((c) => !HIDDEN_USERS.has(c.id))
              .map((c) => {
                const avatar = `https://avatars.githubusercontent.com/u/${c.id}?s=96&v=4`;
                return (
                  <Link
                    role="button"
                    className="relative rounded-full aspect-square bg-gray-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden transition-transform transform hover:scale-110 hover:shadow-lg"
                    href={`https://github.com/${c.login}`}
                    rel="noreferrer"
                    target="_blank"
                    key={c.id}
                    title={c.login}
                  >
                    <Image
                      alt={`${c.login}'s avatar`}
                      src={avatar}
                      width={96}
                      height={96}
                      sizes="(max-width: 768px) 40px, (max-width: 1024px) 56px, 64px"
                      className="absolute inset-0 w-full h-full object-cover rounded-full bg-white"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                );
              })}
          </div>
        )}
      </section>
    </>
  );
}
