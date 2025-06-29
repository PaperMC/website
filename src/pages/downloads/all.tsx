import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

import SoftwareBuildsTable from "@/components/data/SoftwareBuildsTable";
import DownloadsTree from "@/components/layout/DownloadsTree";
import SEO from "@/components/util/SEO";
import { useVersionBuilds, getProject, useProject } from "@/lib/service/fill";
import type { Project } from "@/lib/service/types";

const INITIAL_PROJECT = "paper";

interface LegacyDownloadProps {
  initialProjectId: string;
  initialProjectVersion: string;
}

export const getStaticProps: GetStaticProps<LegacyDownloadProps> = async () => {
  const project: Project = await getProject(INITIAL_PROJECT);
  const flattenedVersions = Object.values(project.versions).flat();
  return {
    props: {
      initialProjectId: project.project.id,
      initialProjectVersion: flattenedVersions[0],
    },
  };
};

const LegacyDownloads: NextPage<LegacyDownloadProps> = ({
  initialProjectId,
  initialProjectVersion,
}) => {
  const router = useRouter();
  const downloadsTreeRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [selectedVersion, setSelectedVersion] = useState(initialProjectVersion);
  const { data: builds } = useVersionBuilds(selectedProject, selectedVersion);
  const { data: project } = useProject(selectedProject);

  // Auto-select project from query parameter
  useEffect(() => {
    const { project: projectParam } = router.query;
    if (projectParam && typeof projectParam === "string") {
      const validProjects = ["paper", "velocity", "folia", "waterfall"];
      if (validProjects.includes(projectParam)) {
        setSelectedProject(projectParam);
        // Fetch the project and set the first version
        getProject(projectParam).then((proj) => {
          const flattenedVersions = Object.values(proj.versions).flat();
          if (flattenedVersions.length > 0) {
            setSelectedVersion(flattenedVersions[0]);
          }
        });
        // Scroll to the selected project after a short delay to ensure the tree is rendered
        setTimeout(() => {
          const projectElement = downloadsTreeRef.current?.querySelector(
            `[data-project="${projectParam}"]`,
          );
          if (projectElement) {
            projectElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    }
  }, [router.query]);

  // Handler for selecting a project/version from the tree
  const handleSelect = (project: string, version?: string) => {
    setSelectedProject(project);
    if (version) {
      setSelectedVersion(version);
    } else {
      // Fetch the project and set the first version
      getProject(project).then((proj) => {
        const flattenedVersions = Object.values(proj.versions).flat();
        if (flattenedVersions.length > 0) {
          setSelectedVersion(flattenedVersions[0]);
        }
      });
    }
  };

  const eol = selectedProject === "waterfall";
  const flattenedVersions = Object.values(project?.versions ?? {}).flat();
  const latestVersion = flattenedVersions[0];
  const legacy = selectedVersion !== latestVersion;
  const experimental =
    builds?.[0]?.channel === "ALPHA" || builds?.[0]?.channel === "BETA";

  return (
    <>
      <SEO
        title="Build explorer"
        description="Build explorer for PaperMC projects. Proceed with caution!"
        keywords={[]}
        canonical="/downloads/all"
      />
      <div className="flex flex-col h-screen">
        <div className="h-16" />
        <div className="flex-1 flex flex-row min-h-0">
          <DownloadsTree
            ref={downloadsTreeRef}
            selectedProject={selectedProject}
            selectedVersion={selectedVersion}
            onSelect={handleSelect}
          />
          <div className="flex-1 overflow-auto">
            {legacy && (
              <>
                <div className="text-center px-4 py-2 font-bold bg-red-400 dark:bg-red-500 shadow-md">
                  Legacy builds are not supported. Proceed at your own risk!
                </div>
              </>
            )}
            {experimental && (
              <>
                <div className="text-center px-4 py-2 font-bold bg-orange-400 dark:bg-orange-500 shadow-md">
                  Experimental builds are not ready for production servers.
                  Proceed at your own risk!
                </div>
              </>
            )}
            {eol && (
              <div className="text-center px-4 py-2 font-bold bg-yellow-400 dark:bg-yellow-500 shadow-md">
                EOL builds are not supported. Proceed at your own risk!
              </div>
            )}
            <SoftwareBuildsTable
              project={selectedProject}
              version={selectedVersion}
              builds={Array.isArray(builds) ? builds : []}
              eol={eol}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LegacyDownloads;
