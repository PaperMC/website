import type { NextPage } from "next";
import Image from "next/image";

import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import GlobeAmericasIcon from "@/assets/icons/heroicons/globe-americas.svg";
import HeartIcon from "@/assets/icons/heroicons/heart.svg";
import FeatureCard from "@/components/data/FeatureCard";
import Button from "@/components/input/Button";
import SEO from "@/components/util/SEO";
import { useSponsors } from "@/lib/service/sponsors";

const Sponsors: NextPage = () => {
  const { data: sponsorData } = useSponsors();

  return (
    <>
      <SEO
        title="Sponsors"
        description="Without contributors our projects wouldn't be possible. Find out how you can help."
        keywords={["papermc", "paper", "minecraft", "sponsor", "contributing"]}
      />
      <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-32) gap-16">
        <div className="flex-1">
          <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
            Sponsors
          </h1>
          <p className="text-xl mt-4">
            PaperMC is an open community, and part of managing the community
            involves paying for services, servers, and infrastructure. We do
            what we can to keep our costs reasonable and sustainable, but still
            some costs are unavoidable.
          </p>
          <div className="flex flex-row gap-4 mt-8">
            <Button
              variant="filled"
              href="https://opencollective.com/papermc"
              external
            >
              Open Collective
            </Button>
            <Button
              variant="outlined"
              href="https://github.com/sponsors/PaperMC"
              external
            >
              GitHub Sponsors
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex hidden justify-end"></div>
      </header>
      <section
        id="why"
        className="w-full pt-10 pb-5 bg-primary-200 dark:bg-background-dark-80"
      >
        <div className="max-w-7xl mx-auto py-2">
          <h2 className="font-semibold text-xl md:text-2xl px-6 lg:px-4">
            Why You Should Donate
          </h2>
          <div className="grid md:grid-cols-3 mt-6 gap-2 px-2 xl:gap-4">
            <FeatureCard
              icon={GlobeAmericasIcon}
              label="Sustainability"
              description="Donations help keep PaperMC sustainable and open to all. Only those who can afford to donate should do so, and no one should feel bad if they can't. Our financial information is available on our Open Collective page."
            />
            <FeatureCard
              icon={BoltIcon}
              label="Future plans"
              description="We need to upgrade our hosting to meet the growing demand for our services and APIs. This will increase costs, which we hope to offset with donations through Open Collective and GitHub Sponsors."
            />
            <FeatureCard
              icon={HeartIcon}
              label="Giving back"
              description="If we receive more in donations than our monthly costs, we may consider distributing funds to contributors in a fair and transparent way."
            />
          </div>
        </div>
      </section>
      <section id="sponsors" className="px-4 py-8 max-w-7xl mx-auto">
        <h2 className="font-semibold text-xl md:text-2xl">Our Sponsors</h2>
        <p className="text-lg text-gray-900 dark:text-gray-100 mt-3">
          Our current balance is{" "}
          <b>
            $
            {sponsorData &&
              (
                sponsorData.ocData.collective.stats.balance.valueInCents / 100
              )?.toLocaleString("en")}
          </b>
          , our estimated expenses are{" "}
          <b>
            $
            {sponsorData &&
              (
                sponsorData.ocData.collective.stats.monthlySpending
                  .valueInCents / 100
              )?.toLocaleString("en")}
          </b>{" "}
          per month.
        </p>
        <div className="grid grid-cols-8 md:grid-cols-16 lg:grid-cols-18 xl:grid-cols-20 mt-8 gap-2">
          {sponsorData?.ocData?.collective?.contributors?.nodes
            ?.filter((n) => n.name !== "Guest")
            .map((node) => (
              <div
                role="button"
                className="relative rounded-full aspect-square bg-gray-600 flex items-center justify-center text-white font-bold uppercase overflow-auto transition-transform transform hover:(scale-120 shadow-lg)"
                key={node.name}
              >
                {node.name[0]}
                <Image
                  alt={`${node.name}'s avatar`}
                  src={node.image}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  onLoad={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                  unoptimized
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          {sponsorData?.ghData?.organization?.sponsors?.nodes?.map((node) => (
            <a
              role="button"
              className="relative rounded-full aspect-square bg-gray-600 flex items-center justify-center text-white font-bold uppercase overflow-auto transition-transform transform hover:(scale-120 shadow-lg)"
              href={`https://github.com/${node.login}`}
              rel="noreferrer"
              target="_blank"
              key={node.login}
            >
              {node.login[0]}
              <Image
                alt={`${node.login}'s avatar`}
                src={node.avatarUrl}
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
                unoptimized
                fill
                className="object-cover"
              />
            </a>
          ))}
        </div>
      </section>
    </>
  );
};

export default Sponsors;
