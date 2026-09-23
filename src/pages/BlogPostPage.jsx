import { useParams } from "react-router";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { CTASection } from "@/components/blog/CTASection";
import { ArticleSkeleton, LoadingAnnouncer } from "@/components/blog/LoadingState";
import { getPost } from "@/lib/api";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Seo } from "@/lib/seo";
import { useSite } from "@/lib/site";
import { useAsync } from "@/lib/useAsync";
import { NotFoundPage } from "./NotFoundPage";

export function BlogPostPage() {
  const { slug } = useParams();
  const site = useSite();

  const { data, error, loading } = useAsync(() => getPost(slug), [slug]);

  if (loading) {
    return (
      <>
        <LoadingAnnouncer loading />
        <ArticleSkeleton />
      </>
    );
  }

  // A missing post renders the 404 page, which also carries `noindex`.
  if (error?.status === 404) return <NotFoundPage />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <h1 className="text-2xl font-semibold text-white">Couldn't load this article</h1>
        <p className="mt-3 text-zinc-400">Try again in a moment.</p>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <>
      <Seo
        title={`${post.title} | ContioReach`}
        description={post.description || post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverImage || undefined}
        alt={post.title}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        keywords={[
          post.category?.toLowerCase(),
          post.primaryKeyword,
          ...(post.tags?.map((tag) => tag.name?.toLowerCase()) || []),
          "headless cms",
          "content marketing",
          "blog",
        ]}
      />

      {/* Home > Blog > Article — the leaf uses the post's own title rather than
          the SEO title with its site suffix. */}
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ],
          site.siteUrl,
        )}
      />
      <JsonLd data={blogPostingSchema(post, site.siteUrl)} />

      <BlogDetail post={post} relatedBlogs={related} />
      <CTASection />
    </>
  );
}
