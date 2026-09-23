import { Link } from "react-router";
import { Aurora } from "@/components/blog/Aurora";
import { Seo } from "@/lib/seo";

export function NotFoundPage({ title = "We couldn't find that page" }) {
  return (
    <div className="relative flex items-center overflow-hidden">
      {/* A 404 should never be indexed, whatever the site-wide switch says. */}
      <Seo
        title="Page not found | ContioReach"
        description="The page you were looking for could not be found."
        path="/404"
        noIndex
      />
      <Aurora />
      <div className="relative mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-mono text-sm text-zinc-500">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-balance text-white sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-pretty text-zinc-400">
          The article may have been moved or unpublished. The blog index is a good place to pick up
          again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/blog"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Browse the blog
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
