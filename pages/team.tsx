import DiscordIcon from "assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "assets/icons/fontawesome/github-brands.svg";
import teams from "assets/data/team.json";

import type { NextPage } from "next";
import Image from "next/image";
import Button from "~/components/input/Button";
import SEO from "~/components/util/SEO";
import { useGitHubContributors } from "~/service/github";

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
      {teams.map((team) => (
        <section
          id={team.id}
          key={team.id}
          className="px-4 py-8 max-w-7xl mx-auto"
        >
          <h2 className="text-2xl font-medium mb-2">{team.name}</h2>
          <p>
            Illum facilis pariatur quia vel doloremque ab ipsum officia. Illum
            voluptatibus ut laudantium illum asperiores consequatur consequatur
            inventore. Non et molestiae inventore. Quisquam itaque aperiam quia
            sit. Expedita necessitatibus ut officia. Ipsum non fugiat id dolorem
            laudantium laborum magnam quo.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {team.members.map((member) => (
              <article
                key={member.name}
                className="border border-gray-300 rounded-md hover:shadow-md transition-shadow p-4"
              >
                <div className="flex flex-row gap-6">
                  <div className="w-20 h-20 relative bg-gray-600 rounded-md overflow-clip ">
                    {member.avatar && (
                      <Image
                        src={member.avatar}
                        unoptimized
                        objectFit="cover"
                        layout="fill"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 break-all">
                    <span className="font-semibold">{member.name}</span>
                    {member.github && (
                      <a
                        href={`https://github.com/${member.github}`}
                        className="flex flex-row items-center gap-2 mt-2 text-blue-800 text-sm font-medium"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <GitHubIcon className="w-4 h-4 fill-gray-700" />
                        {member.github}
                      </a>
                    )}
                    {member.discord && (
                      <div className="flex flex-row items-center gap-2 mt-1 text-blue-800 text-sm font-medium">
                        <DiscordIcon className="w-4 h-4 fill-gray-700" />
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
          Illum facilis pariatur quia vel doloremque ab ipsum officia. Illum
          voluptatibus ut laudantium illum asperiores consequatur consequatur
          inventore. Non et molestiae inventore. Quisquam itaque aperiam quia
          sit. Expedita necessitatibus ut officia. Ipsum non fugiat id dolorem
          laudantium laborum magnam quo.
        </p>
        <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 mt-8 gap-2">
          {contributors
            ?.filter((contributor) => contributor.id !== 1007849)
            ?.map((contributor) => (
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
                  alt={contributor.login}
                  src={contributor.avatar_url}
                  objectFit="cover"
                  layout="fill"
                  unoptimized
                />
              </a>
            ))}
        </div>
      </section>
    </>
  );
};

export default Team;
