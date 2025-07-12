import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import SoftwareDownload from "@/components/layout/SoftwareDownload";
import { getProjectDescriptor } from "@/lib/util/downloads";

export interface SoftwareDownloadPageProps {
  id: string;
  description: ReactElement | string;
  experimentalWarning?: string;
  eol?: boolean;
}

export default async function SoftwareDownloadPage({
  id,
  description,
  experimentalWarning,
  eol,
}: SoftwareDownloadPageProps) {
  const project = await getProjectDescriptor(id);

  if (!project) {
    notFound();
  }

  return (
    <SoftwareDownload
      id={id}
      project={project}
      description={description}
      experimentalWarning={experimentalWarning}
      eol={eol}
    />
  );
}
