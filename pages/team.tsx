import DiscordIcon from "assets/icons/fontawesome/discord-brands.svg";
import GitHubIcon from "assets/icons/fontawesome/github-brands.svg";
import teams from "assets/data/team.json";

import type { NextPage } from "next";
import Button from "~/components/input/Button";
import SEO from "~/components/util/SEO";
import Image from "next/image";

const Home: NextPage = () => {
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
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {team.members.map((member) => (
              <article
                key={member.name}
                className="border border-gray-300 rounded-md hover:shadow-md transition-shadow p-4"
              >
                <div className="flex flex-row gap-4 items-center">
                  <div className="w-8 h-8 relative bg-gray-600 rounded-md overflow-clip">
                    {member.avatar && (
                      <Image
                        src={member.avatar}
                        unoptimized
                        objectFit="cover"
                        layout="fill"
                      />
                    )}
                  </div>
                  <div className="font-medium">{member.name}</div>
                </div>
                <p className="py-4">
                  Quibusdam distinctio hic inventore nemo tempora velit rerum
                  eum. Quos laudantium et rerum error ex dolor tenetur. Vero
                  quibusdam aut accusamus consequuntur amet voluptas.
                </p>
                {member.github && (
                  <a
                    href={`https://github.com/${member.github}`}
                    className="flex flex-row items-center gap-2 my-2 text-blue-800 font-medium"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <GitHubIcon className="w-6 h-6 fill-gray-700" />
                    {member.github}
                  </a>
                )}
                {member.discord && (
                  <div className="flex flex-row items-center gap-2 my-2 text-blue-800 font-medium">
                    <DiscordIcon className="w-6 h-6 fill-gray-700" />
                    {member.discord}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default Home;
