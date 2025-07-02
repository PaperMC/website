import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "@/styles/globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import AppWrapper from "./app-wrapper";

export const metadata: Metadata = {
  title: {
    default: "PaperMC",
    template: "%s | PaperMC",
  },
  description:
    "PaperMC is a Minecraft software organization focusing on improving the game's ecosystem with faster and more secure software.",
  keywords: ["papermc", "paper", "velocity", "minecraft", "performance"],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
