import {
  Briefcase,
  Coffee,
  HandHeart,
  Languages,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ScenarioCategory } from "@/lib/types";

const ICONS: Record<ScenarioCategory, LucideIcon> = {
  interviews: Briefcase,
  "meetings-work": Users,
  "small-talk": Coffee,
  "esl-fluency": Languages,
  "difficult-conversations": HandHeart,
};

interface Props {
  category: ScenarioCategory;
  className?: string;
  strokeWidth?: number;
}

export function CategoryIcon({
  category,
  className = "w-4 h-4",
  strokeWidth = 1.5,
}: Props) {
  const Icon = ICONS[category];
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
