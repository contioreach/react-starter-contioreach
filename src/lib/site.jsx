import { createContext, useContext } from "react";

/* The public configuration, fetched once at startup from GET /api/config and
   passed down from here. It is served at runtime rather than baked into the
   bundle, so one build artifact runs in staging and production. */
const SiteContext = createContext(null);

export function SiteProvider({ value, children }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) {
    throw new Error("useSite must be used inside <SiteProvider>");
  }
  return site;
}
