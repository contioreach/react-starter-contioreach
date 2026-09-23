import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { getConfig } from "./lib/api";
import { SiteProvider } from "./lib/site";
import "./styles/global.css";

/* The public configuration is fetched once before the app renders, so no
   component ever has to handle it being absent. It is a single same-origin
   request against a response the server marks cacheable. */
function Bootstrap() {
  const [site, setSite] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getConfig().then(setSite).catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">The API server isn't reachable</h1>
          <p className="mt-3 max-w-md text-zinc-400">
            Start it with <code className="font-mono text-cyan-300">npm run dev</code>, and check
            that the variables in <code className="font-mono text-cyan-300">.env</code> are filled
            in.
          </p>
        </div>
      </div>
    );
  }

  // A blank first paint rather than a spinner: the config request is local and
  // fast, and a flashed spinner would be noise.
  if (!site) return null;

  return (
    <SiteProvider value={site}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SiteProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
);
