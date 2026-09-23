import { useParams, useSearchParams } from "react-router";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogListing } from "@/components/blog/BlogListing";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { CTASection } from "@/components/blog/CTASection";
import { ErrorState, ListingSkeleton, LoadingAnnouncer } from "@/components/blog/LoadingState";
import { Pagination } from "@/components/blog/Pagination";
import { getCategory, getListing } from "@/lib/api";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Seo } from "@/lib/seo";
import { useSite } from "@/lib/site";
import { useAsync } from "@/lib/useAsync";
import { POSTS_PER_PAGE } from "#shared/constants.js";
import { NotFoundPage } from "./NotFoundPage";

export function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const site = useSite();

  /* Both requests go out together rather than one after the other: the listing
     does not need the category record, only its slug. */
  const combined = useAsync(
    () =>
      Promise.all([
        getCategory(slug),
        getListing({ page: currentPage, limit: POSTS_PER_PAGE, category: slug }),
      ]),
    [slug, currentPage],
  );

  const { data, error, loading } = combined;

  if (error?.status === 404) return <NotFoundPage title="We couldn't find that category" />;

  const [category, listing] = data || [];
  const lower = category?.name?.toLowerCase() || "";

  return (
    <>
      {category && (
        <>
          <Seo
            title={`${category.name} Articles | ContioReach Blog`}
            description={
              category.description ||
              `Expert insights, strategies, and guides on ${lower}. Browse every ${lower} article on the ContioReach blog.`
            }
            path={`/blog/category/${slug}`}
            alt={`${category.name} articles on the ContioReach blog`}
            keywords={[lower, slug, "headless cms", "content marketing", "blog"]}
          />
          {/* Built from the loaded category so the crumb uses its display name. */}
          <JsonLd
            data={breadcrumbSchema(
              [
                { name: "Blog", path: "/blog" },
                { name: category.name, path: `/blog/category/${slug}` },
              ],
              site.siteUrl,
            )}
          />
        </>
      )}
      <LoadingAnnouncer loading={loading} />

      <BlogHero
        eyebrow={category?.name || "Category"}
        heading={
          <>
            Everything on{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              {category?.name || "…"}
            </span>
          </>
        }
        paragraph={
          category?.description ||
          (category
            ? `Expert insights, strategies, and guides on ${lower}, plus what we're learning building ContioReach.`
            : "")
        }
        stat={listing?.meta?.total ? `${listing.meta.total} articles in this category` : null}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-14">
        {loading ? (
          <ListingSkeleton />
        ) : error ? (
          <ErrorState title="Couldn't load this category" />
        ) : (
          <>
            <CategoryPills categories={listing.categories} active={slug} />
            <BlogListing posts={listing.posts} featureFirst={currentPage === 1} />
            <Pagination meta={listing.meta} basePath={`/blog/category/${slug}`} />
          </>
        )}
      </div>

      <CTASection />
    </>
  );
}
