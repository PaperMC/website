import Head from "next/head";
import Script from "next/script";
import type { ReactElement } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
}: SEOProps): ReactElement => {
  const fullTitle = title === "Home" ? "PaperMC" : `${title} | PaperMC`;
  const siteUrl = `https://papermc.io${canonical}`;
  const imageUrl = "https://papermc.io/assets/logo/256x.png";
  
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(", ")} />
        <meta name="author" content="PaperMC Team" />
        <meta httpEquiv="Cache-Control" content="max-age=300" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="PaperMC" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content="PaperMC Logo" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PaperPowered" />
        <meta name="twitter:creator" content="@PaperPowered" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      
      {/* Analytics Script */}
      <Script
        src="https://trk.papermc.io/api/init"
        data-website-id="25e9dbc9-fc84-4d4a-af95-82d38c56d2d3"
        strategy="afterInteractive"
      />
      
      {/* Structured data for better SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PaperMC",
            "url": "https://papermc.io",
            "logo": imageUrl,
            "sameAs": [
              "https://twitter.com/PaperPowered",
              "https://github.com/PaperMC"
            ],
            "description": "PaperMC improves Minecraft's ecosystem with fast, secure software and an expanding plugin API."
          })
        }}
      />
    </>
  );
};

export default SEO;
