import Link from "next/link";

import FoliaIcon from "@/assets/brand/folia.svg";
import PaperIcon from "@/assets/brand/paper.svg";
import VelocityIcon from "@/assets/brand/velocity.svg";
import WaterfallIcon from "@/assets/brand/waterfall.svg";
import ArchiveIcon from "@/assets/icons/fontawesome/box-archive.svg";

const ICONS = {
  paper: PaperIcon,
  velocity: VelocityIcon,
  folia: FoliaIcon,
  waterfall: WaterfallIcon,
} as const;

export interface SoftwarePreviewProps {
  id: string;
  name: string;
  description?: string;
  download?: boolean;
  javadocs?: string;
  eol?: boolean;
}

const SoftwarePreview = ({ id, name, description, download, javadocs, eol }: SoftwarePreviewProps) => {
  const Icon = ICONS[id as keyof typeof ICONS];

  return (
    <Link
      href={download ? `/downloads/${id}` : javadocs ? `https://jd.papermc.io/${id}/${javadocs}` : `/software/${id}`}
    >
      <article className="rounded-xl transition-all h-full p-4 md:p-8 hover:shadow-lg hover:bg-primary-300 dark:hover:bg-gray-800">
        <div className="flex flex-row items-center gap-4">
          <div className="rounded-lg w-12 h-12 bg-gray-800 p-3">{Icon && <Icon />}</div>
          <h3 className="font-medium flex-1 flex gap-4 items-center">
            {name} {eol && <ArchiveIcon className="fill-current h-6" />}
          </h3>
        </div>

        {description && <p className="text-gray-800 dark:text-gray-200 mt-4">{description}</p>}
      </article>
    </Link>
  );
};

export default SoftwarePreview;
