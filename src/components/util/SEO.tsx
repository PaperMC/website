import Head from "next/head";

export interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

const SEO = ({ title, description, keywords, canonical }: SEOProps) => {
  return (
    <Head>
      <title>{title + " | PaperMC"}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      <link rel="canonical" href={`https://papermc.io` + canonical} />

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

      <script
        async
        defer
        src="https://trk.papermc.io/api/init"
        data-website-id="25e9dbc9-fc84-4d4a-af95-82d38c56d2d3"
      ></script>
    </Head>
  );
};

export default SEO;
