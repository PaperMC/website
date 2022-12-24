import type { FunctionComponent, ReactElement } from "react";

import Button from "@/components/input/Button";

export interface SoftwareHeaderProps {
  id: string;
  name: string;
  versionGroup: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: FunctionComponent<any>;
  header: ReactElement;
  description: string;
}

const SoftwareHeader = ({
  id,
  name,
  versionGroup,
  icon: Icon,
  header,
  description,
}: SoftwareHeaderProps): ReactElement => (
  <header className="max-w-7xl flex flex-row mx-auto px-4 pt-32 pb-26 lg:(pt-48 pb-46) gap-16">
    <div className="flex-1">
      <div className="flex flex-row mb-6 gap-4 items-center">
        <div className="w-12 h-12 rounded-lg bg-gray-800 p-3">
          {Icon && <Icon />}
        </div>
        <h1 className="font-medium text-xl">{name}</h1>
      </div>
      <h2 className="font-medium leading-normal lg:(text-5xl leading-normal) text-4xl">
        {header}
      </h2>
      <p className="text-xl mt-4">{description}</p>
      <div className="flex flex-row gap-4 mt-8">
        <Button variant="filled" href={`/downloads/${id}`}>
          Downloads
        </Button>
        <Button
          variant="outlined"
          href={`https://docs.papermc.io/${id}`}
          external
        >
          Documentation
        </Button>
        <Button
          variant="outlined"
          href={`https://jd.papermc.io/${id}/${versionGroup}`}
          external
        >
          Javadoc
        </Button>
      </div>
    </div>
    <div className="flex-1 lg:flex hidden justify-end"></div>
  </header>
);

export default SoftwareHeader;
