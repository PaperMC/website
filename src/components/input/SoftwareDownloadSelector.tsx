import { useContext } from "react";
import { DownloadsContext } from "~/context/downloads";
import SegmentedControls from "~/components/input/SegmentedControls";
import SegmentedControlItem from "~/components/input/SegmentedControlIem";

const projects = [
  { id: "paper", name: "Paper" },
  { id: "velocity", name: "Velocity" },
  { id: "waterfall", name: "Waterfall" }
];

const SoftwareDownloadSelector = () => {
  const { selectedProject, setSelectedProject } = useContext(DownloadsContext);

  return (
    <div className="w-full md:w-100">
      <SegmentedControls selectedIndex={projects.findIndex(({ id }) => id === selectedProject)}>
        <SegmentedControlItem onClick={() => setSelectedProject("paper")}>
          Paper
        </SegmentedControlItem>
        <SegmentedControlItem onClick={() => setSelectedProject("velocity")}>
          Velocity
        </SegmentedControlItem>
        <SegmentedControlItem onClick={() => setSelectedProject("waterfall")}>
          Waterfall
        </SegmentedControlItem>
      </SegmentedControls>
    </div>
  );
};

export default SoftwareDownloadSelector;