// src/utils/ga4.js
export const track = (eventName, params = {}) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
      return;
    }
    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch {
    // never block UI
  }
};

// SPA-safe pageview for React Router
export const trackPageView = (path) => {
  track("page_view", {
    page_path: path,
    page_location: window.location.href,
  });
};