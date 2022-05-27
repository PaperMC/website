import Link from "next/link";

export interface SoftwarePreviewProps {
  id: string;
  name: string;
  description: string;
}

const SoftwarePreview = ({ id, name, description }: SoftwarePreviewProps) => (
  <Link href={`/software/${id}`} passHref>
    <a>
      <article className="rounded-xl transition-shadow transition-color p-8 hover:(shadow-lg bg-primary-300)">
        <div className="flex flex-row items-center gap-4 mb-4">
          <div className="rounded-lg w-12 h-12 bg-gray-800" />
          <h3 className="font-medium">
            {name}
          </h3>
        </div>

        <p className="text-gray-800">
          {description}
        </p>
      </article>
    </a>
  </Link>
);

export default SoftwarePreview;
