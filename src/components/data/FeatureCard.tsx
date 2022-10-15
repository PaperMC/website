import type { FunctionComponent } from "react";

export interface FeatureCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: FunctionComponent<any>;
  label: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, label, description }: FeatureCardProps) => (
  <div className="p-4">
    <div className="flex flex-row items-center gap-4 mb-4">
      <div className="rounded-lg w-12 h-12 bg-gray-800 p-3">
        <Icon className="text-white " />
      </div>
      <h3 className="font-medium flex-1">{label}</h3>
    </div>
    <p className="text-gray-800 dark:text-gray-300">{description}</p>
  </div>
);

export default FeatureCard;
