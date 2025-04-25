import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "windi.css";
import "@/styles/globals.css";

import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

import ErrorBoundary from "@/components/util/ErrorBoundary";

// Dynamically load components that are not needed for initial paint
const NavBar = dynamic(() => import("@/components/layout/NavBar"), { 
  ssr: true,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), { 
  ssr: true,
});

/**
 * Main application component handling layouts and error boundaries
 */
const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [isClient, setIsClient] = useState(false);

  // Used to detect if we're running on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <ErrorBoundary>
        <NavBar component={Component} />
        <main className="flex-1">
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </main>
        {router.route !== "/downloads/all" && <Footer />}
      </ErrorBoundary>
    </>
  );
};

export default MyApp;
