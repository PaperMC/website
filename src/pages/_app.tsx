import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "windi.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

import NavBar from "@/components/layout/NavBar";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <NavBar component={Component} />
    <main>
      <Component {...pageProps} />
    </main>
  </>
);

export default MyApp;
