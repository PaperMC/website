import { createContext } from "react";
import { Build } from "~/service/types";

export interface DownloadsContextProps {
  selectedProject: string;
  project?: ProjectDescriptor;

  setSelectedProject(id: string): void;

  builds?: Build[];
}

export interface ProjectDescriptor {
  name: string;
  latestVersion: string;
}

export const DownloadsContext = createContext<DownloadsContextProps>({
  selectedProject: "paper",
  project: undefined,
  setSelectedProject(id: string) {
    // NOOP
  },
  builds: undefined
});

