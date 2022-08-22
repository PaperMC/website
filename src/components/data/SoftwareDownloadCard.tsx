import clsx from "clsx";

import { useProject } from "@/lib/service/v2";

export interface SoftwareDownloadCardProps {
  id: string;
  name: string;
  selected?: boolean;
  onSelect: () => void;
}

const SoftwareDownloadCard = ({
  id,
  name,
  selected,
  onSelect,
}: SoftwareDownloadCardProps) => {
  const { data } = useProject(id);

  return (
    <article
      role="button"
      className={clsx(
        "rounded-xl transition-shadow transition-color p-4 bg-primary-200 shadow-sm hover:shadow-lg",
        selected ? "bg-primary-400" : "hover:bg-primary-300"
      )}
      onClick={onSelect}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="rounded-lg w-12 h-12 bg-gray-800" />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-800">{data?.versions.length}</p>
        </div>
      </div>
    </article>
  );
};

export default SoftwareDownloadCard;
