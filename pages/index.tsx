import type { NextPage } from "next";
import Button from "~/components/input/Button";

const Home: NextPage = () => {
  return (
    <div>
      <header className="container flex flex-row mx-auto px-4 py-32 lg:py-40 gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Modern technology. <br />
            <span className="text-blue-500">Built to perform.</span>
          </h1>
          <p className="text-xl mt-4">
            PaperMC is a Minecraft software organization focusing on improving
            the Minecraft ecosystem with faster and more secure software.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button variant="filled" href="/downloads">
              Downloads
            </Button>
            <Button variant="outlined" href="https://docs.papermc.io" external>
              Documentation
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:block hidden" />
      </header>
    </div>
  );
};

export default Home;
