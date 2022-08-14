import { NextPage } from "next";
import SEO from "~/components/util/SEO";
import Button from "~/components/input/Button";

import SavingsIllustration from "assets/illustrations/undraw/savings.svg";
import CodeReviewIllustration from "assets/illustrations/undraw/code-review.svg";

const Contributing: NextPage = () => (
  <>
    <SEO
      title="Contributing"
      description="Without contributors our projects wouldn't be possible. Find out how you can help out."
      keywords={["papermc", "paper", "minecraft", "sponsor", "contributing"]}
    />
    <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-32) gap-16">
      <div className="flex-1">
        <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
          Contributing
        </h1>
        <p className="text-xl mt-4">
          {
            "Our projects are based on community contributions and wouldn't be possible workout them. There are a lot of ways to contribute, even without programming knowledge."
          }
        </p>
        <div className="flex flex-row gap-4 mt-8"></div>
      </div>
      <div className="flex-1 lg:flex hidden justify-end"></div>
    </header>
    <section
      id="donate"
      className="px-4 py-8 max-w-7xl mx-auto flex flex-row items-center"
    >
      <div className="flex-1">
        <h2 className="font-medium text-2xl md:text-4xl">...Financially</h2>
        <p className="md:(mt-6 text-lg) text-gray-900 mt-3">
          PaperMC uses Open Collective to manage various recurring expenses,
          mostly related to infrastructure. Open Collective allows us to be
          extremely transparent, so you can always see how your donations are
          used.
        </p>
        <div className="flex flex-row gap-4 mt-8">
          <Button
            variant="filled"
            href="http://opencollective.com/papermc"
            external
            dense
          >
            Open Collective
          </Button>
          <Button
            variant="outlined"
            href="https://github.com/sponsors/PaperMC"
            external
            dense
          >
            GitHub Sponsors
          </Button>
        </div>
      </div>
      <div className="flex-1 lg:flex hidden justify-end">
        <SavingsIllustration className="max-w-72" />
      </div>
    </section>
    <section
      id="code"
      className="px-4 py-8 max-w-7xl mx-auto flex flex-row items-center mt-12"
    >
      <div className="flex-1">
        <h2 className="font-medium text-2xl md:text-4xl">...Code</h2>
        <p className="md:(mt-6 text-lg) text-gray-900 mt-3">
          A big chunk of the code in our projects is written by community
          members, and we are always happy about Pull Requests to our
          repositories.
        </p>
        <div className="flex flex-row gap-4 mt-8">
          <Button
            variant="filled"
            href="https://github.com/PaperMC/Paper/blob/master/CONTRIBUTING.md"
            external
            dense
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="flex-1 lg:flex hidden justify-end">
        <CodeReviewIllustration className="max-w-72" />
      </div>
    </section>
    <section
      id="support"
      className="px-4 py-8 max-w-7xl mx-auto flex flex-row items-center mt-12"
    >
      <div className="flex-1">
        <h2 className="font-medium text-2xl md:text-4xl">...Support</h2>
        <p className="md:(mt-6 text-lg) text-gray-900 mt-3">
          A lot of users result in a lot of questions. Everyone is welcome to
          answer questions or provide support, whether on our Discord server or
          in our forums
        </p>
        <div className="flex flex-row gap-4 mt-8">
          <Button variant="filled" href="/community" dense>
            Our Community
          </Button>
        </div>
      </div>
      <div className="flex-1 lg:flex hidden justify-end"></div>
    </section>
    <section
      id="documentation"
      className="px-4 py-8 max-w-7xl mx-auto flex flex-row items-center mt-12"
    >
      <div className="flex-1">
        <h2 className="font-medium text-2xl md:text-4xl">...Documentation</h2>
        <p className="md:(mt-6 text-lg) text-gray-900 mt-3">
          Constantly evolving software needs constantly updated documentation.
          No matter if you want to report missing information or add guides
          yourself, we always appreciate help.
        </p>
        <div className="flex flex-row gap-4 mt-8">
          <Button
            variant="filled"
            href="https://github.com/PaperMC/docs"
            external
            dense
          >
            Docs Repository
          </Button>
        </div>
      </div>
      <div className="flex-1 lg:flex hidden justify-end"></div>
    </section>
  </>
);

export default Contributing;
