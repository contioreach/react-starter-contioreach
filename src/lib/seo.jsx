import { useSite } from "./site";

/* React 19 hoists <title>, <meta> and <link> out of a component and into the
   document head, so a page can declare its own head inline with no helmet
   library. This keeps that declaration in one place.

   Note what this is for: it updates the head during client-side navigation.
   The head a *crawler* sees on first byte is written by the server before the
   document is sent — see server/seo.js. Both exist, and they agree. */
export function Seo({
  title,
  description,
  path = "/",
  image,
  alt,
  type = "website",
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime,
}) {
  const site = useSite();
  const url = `${site.siteUrl}${path}`;
  const ogImage = image || `${site.siteUrl}/og-default.png`;
  const blocked = noIndex || site.noIndex;
  const keywordList = keywords.filter(Boolean).join(", ");

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordList && <meta name="keywords" content={keywordList} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={blocked ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ContioReach" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={alt || title} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      /* Structured data we generate ourselves. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
