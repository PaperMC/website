import type { Metadata } from "next";

import TeamClient from "./team-client";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the team behind PaperMC, a Minecraft software organization focusing on improving the game's ecosystem with faster and more secure software.",
  keywords: ["papermc", "paper", "minecraft", "team"],
};

export default function TeamPage() {
  return <TeamClient />;
}
