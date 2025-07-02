"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      {pathname !== "/downloads/all" && <Footer />}
    </>
  );
}
