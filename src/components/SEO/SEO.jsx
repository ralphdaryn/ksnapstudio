import { useEffect } from "react";

/**
 * Simple SEO helper for CRA + React Router (no Helmet, React 19 safe)
 * - Sets document title
 * - Sets meta description
 * - Sets canonical URL
 * - Optionally noindex pages like /dashboard
 *
 * NOTE: This helps Google understand your pages.
 * Ranking for competitive terms also depends on GBP/reviews/links.
 */

function setOrCreateMeta(name, content) {
  if (!content) return;

  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function setCanonical(href) {
  if (!href) return;

  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function SEO({
  // What shows in Google tab + search title
  title = "KSnap Studio | GTA & Durham Wedding & Portrait Photographer",

  // What shows under the result in Google
  description = "KSnap Studio (ksnapstudio) is a Durham Region & GTA photographer for weddings, engagements, events, and portraits.",

  // Route path like "/packages"
  path = "/",

  // Prevent indexing for private pages
  noIndex = false,
}) {
  useEffect(() => {
    // Uses the current domain automatically (ksnapstudio.ca in production)
    const origin = window.location.origin;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${origin}${cleanPath}`;

    // Title
    document.title = title;

    // Description
    setOrCreateMeta("description", description);

    // Robots
    setOrCreateMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

    // Canonical
    setCanonical(url);
  }, [title, description, path, noIndex]);

  return null;
}