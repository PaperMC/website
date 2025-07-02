"use client";

import SoftwarePreview from "@/components/data/SoftwarePreview";

export default function DownloadsClient() {
  return (
    <>
      <header className="max-w-4xl flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:pt-48 lg:pb-26 gap-2">
        <h1 className="font-medium leading-normal lg:text-5xl lg:leading-normal text-4xl">
          Downloads
        </h1>
        <p className="text-xl text-center mb-6">
          {"Select the software you want to download."}
        </p>
        <h2 className="text-2xl text-center font-medium mt-4">
          Server Software
        </h2>
        <div className="grid md:grid-cols-2 gap-2 px-2 xl:gap-4">
          <SoftwarePreview
            id="paper"
            name="Paper"
            description="Paper is a Minecraft game server, designed to greatly improve performance and offer more advanced features and API."
            download
          />
          <SoftwarePreview
            id="folia"
            name="Folia"
            description="Folia is a new fork of Paper that adds regionized multithreading to the server"
            download
          />
        </div>
        <h2 className="text-2xl text-center font-medium mt-4">
          Proxy Software
        </h2>
        <div className="grid md:grid-cols-2 gap-2 px-2 xl:gap-4">
          <SoftwarePreview
            id="velocity"
            name="Velocity"
            description="Velocity is the modern, high-performance Minecraft server proxy."
            download
          />
          <SoftwarePreview
            id="waterfall"
            name="Waterfall"
            description="Waterfall is a legacy drop-in BungeeCord replacement with some additional improvements to performance and stability."
            download
            eol
          />
        </div>
      </header>
    </>
  );
}
