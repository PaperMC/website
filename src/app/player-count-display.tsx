"use client";

import Skeleton from "@/components/data/Skeleton";
import { useBstatsPlayers } from "@/lib/service/bstats";

interface PlayerCountDisplayProps {
  fallbackPlayers: number;
}

export default function PlayerCountDisplay({}: PlayerCountDisplayProps) {
  const { data: playerData } = useBstatsPlayers();

  if (!playerData) {
    return <Skeleton className="w-30 h-6 inline-block" />;
  }

  return (
    <span className="text-blue-500">
      {Math.round(playerData[0][1] / 1000)}k+
    </span>
  );
}
