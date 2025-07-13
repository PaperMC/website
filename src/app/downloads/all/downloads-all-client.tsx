"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import MenuIcon from "@/assets/icons/heroicons/menu.svg";
import SoftwareBuildsTable from "@/components/data/SoftwareBuildsTable";
import DownloadsTree from "@/components/layout/DownloadsTree";
import { getProject } from "@/lib/service/fill";
import { useProject, useVersionBuilds } from "@/lib/service/hooks";

interface DownloadsAllClientProps {
  initialProjectId: string;
  initialProjectVersion: string;
}

export default function DownloadsAllClient({ initialProjectId, initialProjectVersion }: DownloadsAllClientProps) {
  const searchParams = useSearchParams();
  const projectParam = searchParams?.get("project");
  const downloadsTreeRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [selectedVersion, setSelectedVersion] = useState(initialProjectVersion);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (projectParam && ["paper", "velocity", "folia", "waterfall"].includes(projectParam)) {
      setSelectedProject(projectParam);
      getProject(projectParam).then((proj) => {
        const flattenedVersions = Object.values(proj.versions).flat();
        if (flattenedVersions.length > 0) {
          setSelectedVersion(flattenedVersions[0]);
        }
      });
    }
  }, [projectParam]);

  const { data: builds } = useVersionBuilds(selectedProject, selectedVersion);
  const { data: project } = useProject(selectedProject);

  const eol = selectedProject === "waterfall";
  const flattenedVersions = Object.values(project?.versions ?? {}).flat();
  const latestVersion = flattenedVersions[0];
  const legacy = latestVersion && selectedVersion !== latestVersion;
  const experimental = builds?.[0]?.channel === "ALPHA" || builds?.[0]?.channel === "BETA";

  const handleProjectSelect = (projectId: string, version: string) => {
    setSelectedProject(projectId);
    setSelectedVersion(version);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-16" />

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-background-light-10 dark:bg-background-dark-90 border-b border-gray-300 dark:border-gray-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileMenu}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="w-5 h-5 fill-gray-600 dark:fill-gray-400" />
          </button>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {project?.project.name || selectedProject} {selectedVersion}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-row min-h-0">
        {/* Desktop Tree - Always visible on md+ */}
        <div className="hidden md:block">
          <div ref={downloadsTreeRef}>
            <DownloadsTree
              selectedProject={selectedProject}
              selectedVersion={selectedVersion}
              onSelect={handleProjectSelect}
            />
          </div>
        </div>

        {/* Mobile Tree - Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
            <div
              className="absolute left-0 top-0 h-full w-64 bg-background-light-10 dark:bg-background-dark-90 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Select Project</h3>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5 fill-gray-600 dark:fill-gray-400" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="overflow-auto h-full pb-20">
                <DownloadsTree
                  selectedProject={selectedProject}
                  selectedVersion={selectedVersion}
                  onSelect={handleProjectSelect}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {legacy && (
            <div className="text-center px-4 py-2 font-bold bg-red-400 dark:bg-red-500 shadow-md">
              Legacy builds are not supported. Proceed at your own risk!
            </div>
          )}
          {experimental && (
            <div className="text-center px-4 py-2 font-bold bg-orange-400 dark:bg-orange-500 shadow-md">
              Experimental builds are not ready for production servers. Proceed at your own risk!
            </div>
          )}
          {eol && (
            <div className="text-center px-4 py-2 font-bold bg-yellow-400 dark:bg-yellow-500 shadow-md">
              EOL builds are not supported. Proceed at your own risk!
            </div>
          )}
          <SoftwareBuildsTable project={selectedProject} version={selectedVersion} builds={builds ?? []} eol={eol} />
        </div>
      </div>
    </div>
  );
}
