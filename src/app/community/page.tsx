import type { Metadata } from "next";

import Button from "@/components/input/Button";

export const metadata: Metadata = {
  title: "Community",
  description: "We're happy to have you as a part of the PaperMC community!",
  keywords: ["papermc", "paper", "minecraft", "sponsor", "community"],
};

export default function CommunityPage() {
  return (
    <>
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-32 gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">Join Our Community</h1>
          <p className="text-xl mt-4">
            We&apos;re happy to have you as a part of the PaperMC community! Please read our community guidelines before
            participating.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="/community/guidelines" dense>
              Community Guidelines
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      <section
        id="discord"
        className="px-4 py-4 max-w-7xl mx-auto flex flex-col-reverse items-center gap-8 lg:flex-row"
      >
        <div className="flex-1">
          <h2 className="font-medium text-2xl md:text-4xl">Discord</h2>
          <p className="md:mt-6 md:text-lg text-gray-900 dark:text-gray-100 mt-3">
            Discord is a popular option for many gamers to communicate with each other. We have a Discord community
            server that anyone can join.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="https://discord.gg/papermc" external dense>
              Join Our Discord
            </Button>
          </div>
        </div>
        <div className="justify-start flex w-full lg:flex-1 lg:justify-end"></div>
      </section>
      <section
        id="forums"
        className="px-4 py-4 max-w-7xl mx-auto flex flex-col-reverse items-center mt-12 gap-8 lg:flex-row"
      >
        <div className="flex-1">
          <h2 className="font-medium text-2xl md:text-4xl">Forums</h2>
          <p className="md:mt-6 md:text-lg text-gray-900 dark:text-gray-100 mt-3">
            You can join the forums and chat with other administrators, developers, project staff, and more.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="https://forums.papermc.io/" external dense>
              Forums
            </Button>
          </div>
        </div>
        <div className="justify-start flex w-full lg:flex-1 lg:justify-end"></div>
      </section>
    </>
  );
}
