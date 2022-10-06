import Link from "next/link";
import { FunctionComponent } from "react";

export interface SoftwarePreviewProps {
  id: string;
  name: string;
  icon: FunctionComponent<any>;
  description: string;
  download?: boolean;
}

const SoftwarePreview = ({
  id,
  name,
  icon: Icon,
  description,
  download,
}: SoftwarePreviewProps) => (
  <Link href={download ? `/downloads/${id}` : `/software/${id}`} passHref>
    <a>
      <article className="rounded-xl transition-shadow transition-color p-4 md:p-8 hover:(shadow-lg bg-primary-300 dark:bg-gray-800)">
        <div className="flex flex-row items-center gap-4 mb-4">
          <div className="rounded-lg w-12 h-12 bg-gray-800 p-3">
            <Icon />
          </div>
          <h3 className="font-medium flex-1">{name}</h3>
        </div>

        <p className="text-gray-800 dark:text-gray-200">{description}</p>
      </article>
    </a>
  </Link>
);

export default SoftwarePreview;
