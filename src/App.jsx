import { Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { HomePage } from "@/pages/HomePage";
import { ListingPage } from "@/pages/ListingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/* A browser restores scroll on a real navigation; a SPA has to do it itself,
   or every new page opens halfway down where the last one was left. */
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<ListingPage />} />
          <Route path="/blog/category/:slug" element={<CategoryPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
