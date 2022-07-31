import { NextPage } from "next";
import DownloadsTree from "~/components/layout/DownloadsTree";
import SoftwareBuildsTable from "~/components/data/SoftwareBuildsTable";
import { useVersionBuilds } from "~/service/v2";
import { useState } from "react";
import SEO from "~/components/util/SEO";

const LegacyDownloads: NextPage = () => {
  const [selectedProject, setSelectedProject] = useState("paper");
  const [selectedVersion, setSelectedVersion] = useState("");
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
