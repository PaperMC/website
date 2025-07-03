import BoltIcon from "@/assets/icons/heroicons/bolt.svg";
import ChatBubbleLeftRightIcon from "@/assets/icons/heroicons/chat-bubble-left-right.svg";
import CodeBracketIcon from "@/assets/icons/heroicons/code-bracket.svg";
import GlobeAmericasIcon from "@/assets/icons/heroicons/globe-americas.svg";
import HeartIcon from "@/assets/icons/heroicons/heart.svg";

const ICONS = {
  bolt: BoltIcon,
  "chat-bubble-left-right": ChatBubbleLeftRightIcon,
  "code-bracket": CodeBracketIcon,
  "globe-americas": GlobeAmericasIcon,
  heart: HeartIcon,
} as const;

export interface FeatureCardProps {
  iconId: keyof typeof ICONS;
  label: string;
  description: string;
}

const FeatureCard = ({ iconId, label, description }: FeatureCardProps) => {
  const Icon = ICONS[iconId];

  return (
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
};

export default FeatureCard;
