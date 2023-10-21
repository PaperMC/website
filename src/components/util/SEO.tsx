import Head from "next/head";
import type { ReactElement } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
}

const SEO = ({ title, description, keywords }: SEOProps): ReactElement => {
  return (
    <Head>
      <title>{title + " | PaperMC"}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="PaperMC" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:image" content="/assets/logo/256x.png" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/assets/logo/256x.png" />
    </Head>
  );
};

export default SEO;
