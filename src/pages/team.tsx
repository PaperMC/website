import type { NextPage } from "next";
import Image from "next/image";

import DiscordIcon from "@/assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "@/assets/icons/fontawesome/github-brands.svg";
import Button from "@/components/input/Button";
import SEO from "@/components/util/SEO";
import { useGitHubContributors } from "@/lib/service/github";
import teams from "assets/data/teamV2.json";
import styles from "styles/pages/team.module.css";

const HIDDEN_USERS = [1007849, 23557539, 49699333]; // md_5, EcoCityCraftCI, dependabot

const Team: NextPage = () => {
  const { data: contributors } = useGitHubContributors();

  return (
    <>
      <SEO
        title="Team"
        description="Meet the team behind PaperMC, a Minecraft software organization focusing on improving
            the game’s ecosystem with faster and more secure software."
        keywords={["papermc", "paper", "minecraft", "team"]}
      />
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:(pt-48 pb-46) gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Meet our team
          </h1>
          <p className="text-xl mt-4">
            Meet the members behind PaperMC, a Minecraft software organization
            focusing on improving the game’s ecosystem with faster and more
            secure software.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="/sponsors">
              Sponsor
            </Button>
            <Button
              variant="outlined"
              href="https://github.com/PaperMC"
              external
            >
              GitHub
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      {teams.map((teamGroup) => (
        <section
          id={teamGroup.id}
          key={teamGroup.id}
          className="px-4 py-8 max-w-7xl mx-auto"
        >
          <h2 className="text-2xl font-medium mb-2">{teamGroup.name}</h2>
          {teamGroup.groups.length > 1 ? (
            teamGroup.groups.map((group) => (
              <div
                key={group.id}
                className={`text-sm p-2 m-2 ${styles[group.id]} rounded-1xl`}
              >
                {group.description}
              </div>
            ))
          ) : (
            <div key={teamGroup.groups[0].id}>
              {teamGroup.groups[0].description}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 bg-opacity-50">
            {teamGroup.groups
              .flatMap((group) =>
                group.members.map((member) => ({
                  ...member,
                  color: `${group.id}-text`,
                }))
              )
              .map((member) => (
                <article
                  key={member.name}
                  className={`border border-gray-300 dark:border-gray-700 rounded-md hover:shadow-md transition-shadow p-4`}
                >
                  <div className="flex flex-row gap-6">
                    <div className="w-20 h-20 relative bg-gray-600 rounded-md overflow-clip ">
                      {member.avatar && (
                        <Image
                          alt={`${member.name}'s avatar`}
                          src={member.avatar}
                          objectFit="cover"
                          layout="fill"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 break-all">
                      <span className={`font-semibold ${styles[member.color]}`}>
                        {member.name}
                      </span>
                      {member.github && (
                        <a
                          href={`https://github.com/${member.github}`}
                          className="flex flex-row items-center gap-2 mt-2 text-blue-800 dark:text-blue-300 text-sm font-medium"
                          rel="noreferrer"
                          target="_blank"
                        >
                          <GitHubIcon className="w-4 h-4 fill-gray-700 dark:fill-gray-300" />
                          {member.github}
                        </a>
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
          Contributors are those people who have helped the organization by
          making important contributions to our codebases. From adding a new
          redstone engine to PRing a fix for a nasty bug, our contributors have
          helped us to provide the best software we possibly can.
        </p>
        <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 mt-8 gap-2">
          {contributors?.map((page) =>
            page
              .filter((contributor) => !HIDDEN_USERS.includes(contributor.id))
              .map((contributor) => (
                <a
                  role="button"
                  className="relative rounded-full aspect-square bg-gray-600 flex items-center justify-center text-white font-bold uppercase overflow-auto transition-transform transform hover:(scale-120 shadow-lg)"
                  href={`https://github.com/${contributor.login}`}
                  rel="noreferrer"
                  target="_blank"
                  key={contributor.id}
                >
                  {contributor.login[0]}
                  <Image
                    alt={`${contributor.login}'s avatar`}
                    src={contributor.avatar_url}
                    objectFit="cover"
                    layout="fill"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    onLoad={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                    unoptimized
                  />
                </a>
              ))
          )}
        </div>
      </section>
    </>
  );
};

export default Team;
