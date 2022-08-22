import { GetStaticProps, NextPage } from "next";
import { useState } from "react";

import SoftwareBuildsTable from "~/components/data/SoftwareBuildsTable";
import DownloadsTree from "~/components/layout/DownloadsTree";
import SEO from "~/components/util/SEO";
import { Project } from "~/service/types";
import { useVersionBuilds, getProject } from "~/service/v2";

const INITIAL_PROJECT = "paper";

interface LegacyDownloadProps {
  initialProjectId: string;
  initialProjectVersion: string;
}

export const getStaticProps: GetStaticProps<LegacyDownloadProps> = async () => {
  const project: Project = await getProject(INITIAL_PROJECT);
  const versions = project.versions;
  return {
    props: {
      initialProjectId: project.project_id,
      initialProjectVersion: versions[versions.length - 1],
    },
  };
};

const LegacyDownloads: NextPage<LegacyDownloadProps> = ({
  initialProjectId,
  initialProjectVersion,
}) => {
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [selectedVersion, setSelectedVersion] = useState(initialProjectVersion);
  const { data: builds } = useVersionBuilds(selectedProject, selectedVersion);

  return (
    <>
      <SEO
        title="Build explorer"
        description="Build explorer for PaperMC projects. Proceed with caution!"
        keywords={[]}
      />
      <div className="flex flex-col h-screen">
        <div className="h-14" />
        <div className="text-center px-4 py-2 font-bold bg-red-400 shadow-md">
          Legacy builds are not supported. Proceed at your own risk!
        </div>
        <div className="flex-1 flex flex-row min-h-0">
          <DownloadsTree
            selectedProject={selectedProject}
            selectedVersion={selectedVersion}
            onSelect={(project, version) => {
              setSelectedProject(project);
              setSelectedVersion(version);
            }}
          />
          <div className="flex-1 overflow-auto">
            <SoftwareBuildsTable
              project={selectedProject}
              version={selectedVersion}
              builds={builds?.builds ?? []}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LegacyDownloads;
