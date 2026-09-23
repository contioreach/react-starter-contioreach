import { useSearchParams } from "react-router";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogListing } from "@/components/blog/BlogListing";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { CTASection } from "@/components/blog/CTASection";
import { ErrorState, ListingSkeleton, LoadingAnnouncer } from "@/components/blog/LoadingState";
import { Pagination } from "@/components/blog/Pagination";
import { getListing } from "@/lib/api";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Seo } from "@/lib/seo";
import { useSite } from "@/lib/site";
import { useAsync } from "@/lib/useAsync";
import { POSTS_PER_PAGE } from "#shared/constants.js";

export function ListingPage() {
  const [searchParams] = useSearchParams();
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const site = useSite();

  const { data, error, loading } = useAsync(
    () => getListing({ page: currentPage, limit: POSTS_PER_PAGE }),
    [currentPage],
  );

  return (
    <>
      <Seo
        title="Blog | Headless CMS, SEO & Content Strategy | ContioReach"
        description="Practical guides on headless CMS, SEO, AI search, blogging, and the workflows behind content that gets discovered, read, and cited."
        path="/blog"
        alt="The ContioReach blog"
        keywords={[
          "headless cms blog",
          "content marketing",
          "seo tips",
          "ai search optimization",
          "blogging workflow",
          "content strategy",
        ]}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }], site.siteUrl)} />
      <LoadingAnnouncer loading={loading} />

      <BlogHero
        heading={
          <>
            Writing about the craft of{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              publishing well
            </span>
          </>
        }
        paragraph="Headless CMS, SEO, AI search, and the workflows behind content that gets discovered, read, and cited."
        stat={data?.meta?.total ? `${data.meta.total} articles and counting` : null}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-14">
        {loading ? (
          <ListingSkeleton />
        ) : error ? (
          <ErrorState title="Couldn't load these articles" />
        ) : (
          <>
            <CategoryPills categories={data.categories} />
            <BlogListing posts={data.posts} featureFirst={currentPage === 1} />
            <Pagination meta={data.meta} basePath="/blog" />
          </>
        )}
      </div>

      <CTASection />
    </>
  );
}
