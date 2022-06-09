import { GetStaticProps, NextPage } from "next";
import { DownloadsContext, ProjectDescriptor } from "~/context/downloads";
import { useState } from "react";
import SoftwareDownloadButton from "~/components/input/SoftwareDownloadButton";
import SoftwareDownloadSelector from "~/components/input/SoftwareDownloadSelector";
import { getProject, getVersionBuilds, useVersionBuilds } from "~/service/v2";

interface DownloadsProps {
  projects: Record<string, ProjectDescriptor>;
}

const Downloads: NextPage<DownloadsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState("paper");
  const { data: builds } = useVersionBuilds(
    selectedProject,
    projects[selectedProject].latestVersion
  );

  return (
    <DownloadsContext.Provider
      value={{
        selectedProject,
        project: projects[selectedProject],
        setSelectedProject,
        builds: builds?.builds,
      }}
    >
      <header className="container flex flex-col items-center mx-auto px-4 pt-32 pb-16 lg:(pt-48 pb-26) gap-2">
        <h1 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
          Downloads
        </h1>
        <p className="text-xl text-center mb-6">
          {"It's time! Get started by downloading our software."}
        </p>
        <SoftwareDownloadSelector />
      </header>
      <section id="software" className="w-full py-16 bg-primary-200">
        <div className="container mx-auto flex flex-col md:flex-row">
          <div className="text-center px-4 md:(flex-1 text-left)">
            <h3 className="font-medium text-xl md:text-2xl">
              Get the latest and greatest.
            </h3>
            <p className="md:text-xl mt-4 text-gray-800 mb-8">
              Get the latest, supported build of{" "}
              {projects[selectedProject].name}. Please note that we only support
              servers running our latest build.
            </p>
            <SoftwareDownloadButton />
          </div>
          <div className="md:flex-1 px-4"></div>
        </div>
      </section>
    </DownloadsContext.Provider>
  );
};

export default Downloads;

const isVersionStable = async (
  project: string,
  version: string
): Promise<boolean> => {
  const { builds } = await getVersionBuilds(project, version);
  for (let i = builds.length - 1; i >= 0; i--) {
    if (builds[i].channel === "default") return true;
  }

  return false;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const projectIds = ["paper", "velocity", "waterfall"];
  const projects: Record<string, ProjectDescriptor> = {};

  for (const id of projectIds) {
    const { project_name, versions } = await getProject(id);

    let latestVersion = versions[versions.length - 1];
    for (let i = versions.length - 1; i >= 0; i--) {
      if (await isVersionStable(id, versions[i])) {
        latestVersion = versions[i];
        break;
      }
    }

    projects[id] = {
      name: project_name,
      latestVersion,
    };
  }

  return {
    props: {
      projects,
    },
    revalidate: 600, // 10 minutes
  };
};
