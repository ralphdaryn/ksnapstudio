// src/pages/Packages/Packages.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./Packages.scss";

import SEO from "../../components/SEO/SEO";

// GA4 event helper (safe even if GA isn't installed yet)
const track = (eventName, params = {}) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
      return;
    }

    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch {
    // fail silently
  }
};

const INTRO = {
  heading: "Every story deserves to be captured beautifully.",
  body:
    "Whether it’s your wedding day, a growing family, or a moment just for you — my packages are designed to fit your vision. Each session includes professional editing, personalized guidance, and timeless images you’ll love to relive for years to come.",
};

const PACKAGES = [
  {
    key: "weddings-half",
    icon: "💍",
    title: "Half-Day Coverage",
    price: "$750",
    tagline: "Perfect for small weddings or intimate celebrations.",
    bullets: [
      "Up to 4 hours of continuous coverage",
      "200+ edited high-resolution images",
      "Private online gallery for viewing & download",
      "Pre-wedding consultation call",
      "Add-ons: extra coverage, second shooter, videography",
    ],
    group: "WEDDING PACKAGES",
    ctaHref: "/contact",
  },
  {
    key: "weddings-full",
    icon: "💍",
    title: "Full-Day Coverage",
    price: "$1,200",
    tagline: "Ideal for capturing your full wedding story from start to finish.",
    bullets: [
      "Up to 8 hours of coverage",
      "500+ edited high-resolution images",
      "Private online gallery for easy sharing",
      "Timeline & planning assistance",
      "Add-ons: engagement session, second shooter, videography",
    ],
    group: "WEDDING PACKAGES",
    ctaHref: "/contact",
  },
  {
    key: "weddings-premium",
    icon: "💍",
    title: "Premium Coverage",
    price: "$1,500",
    tagline: "For couples who want every detail beautifully documented.",
    bullets: [
      "Up to 10 hours of coverage",
      "600+ edited high-resolution images",
      "Complimentary engagement session",
      "Priority editing & delivery",
      "Add-ons: extended coverage, second shooter, videography",
    ],
    group: "WEDDING PACKAGES",
    ctaHref: "/contact",
  },
  {
    key: "engagement",
    icon: "💞",
    title: "ENGAGEMENT SESSION",
    price: "$325",
    tagline: "Celebrate your love story before the big day.",
    bullets: [
      "1–2 hours of coverage",
      "40–60+ edited high-resolution images",
      "1–2 locations",
      "Optional outfit change",
      "Private online gallery",
    ],
    group: "ENGAGEMENT",
    ctaHref: "/contact",
  },
  {
    key: "event-2-hours",
    icon: "🎉",
    title: "2 HOURS",
    price: "$350",
    tagline: "Event Photography",
    bullets: [
      "2 hours of coverage",
      "100+ edited high-resolution images",
      "Private online gallery",
    ],
    group: "EVENT PHOTOGRAPHY",
    ctaHref: "/contact",
  },
  {
    key: "event-3-hours",
    icon: "🎉",
    title: "3 HOURS",
    price: "$475",
    tagline: "Event Photography",
    bullets: [
      "3 hours of coverage",
      "175+ edited high-resolution images",
      "Private online gallery",
    ],
    group: "EVENT PHOTOGRAPHY",
    ctaHref: "/contact",
  },
  {
    key: "event-4-hours",
    icon: "🎉",
    title: "4 HOURS",
    price: "$575",
    tagline: "Event Photography",
    bullets: [
      "4 hours of coverage",
      "250+ edited high-resolution images",
      "Private online gallery",
    ],
    group: "EVENT PHOTOGRAPHY",
    ctaHref: "/contact",
  },
  {
    key: "family",
    icon: "👨‍👩‍👧",
    title: "FAMILY & MATERNITY SESSION",
    price: "$325",
    tagline: "Capture life’s most meaningful milestones together.",
    bullets: [
      "1–1.5 hours of coverage",
      "40+ edited images",
      "1 location",
      "Posing guidance & creative direction",
      "Add-ons: additional family group or location",
    ],
    group: "FAMILY & MATERNITY",
    ctaHref: "/contact",
  },
  {
    key: "portrait",
    icon: "📸",
    title: "PORTRAIT SESSION",
    price: "$275",
    tagline: "Perfect for solo portraits, lifestyle, or branding.",
    bullets: [
      "1 hour of coverage",
      "30–50+ edited high-resolution images",
      "Professional direction throughout the shoot",
      "Add-ons: outfit change, studio upgrade, extra time",
    ],
    group: "PORTRAIT",
    ctaHref: "/contact",
  },
  {
    key: "seasonal",
    icon: "🎄",
    title: "SEASONAL PORTRAIT SESSION",
    price: "$200",
    tagline: "Limited-time themed mini sessions for holidays & special seasons.",
    bullets: [
      "20–30 minutes of coverage",
      "20+ edited images",
      "One setup or location",
      "Private online gallery for download",
    ],
    group: "SEASONAL",
    ctaHref: "/contact",
  },
];

const GROUPS_ORDER = [
  { key: "EVENT PHOTOGRAPHY", icon: "🎉" },
  { key: "WEDDING PACKAGES", icon: "💍" },
  { key: "ENGAGEMENT", icon: "💞" },
  { key: "FAMILY & MATERNITY", icon: "👨‍👩‍👧" },
  { key: "PORTRAIT", icon: "📸" },
  { key: "SEASONAL", icon: "🎄" },
];

const GROUP_IDS = {
  "WEDDING PACKAGES": "weddings",
  ENGAGEMENT: "engagements",
  "EVENT PHOTOGRAPHY": "events",
  "FAMILY & MATERNITY": "family",
  PORTRAIT: "portraits",
  SEASONAL: "seasonal",
};

export default function Packages() {
  const location = useLocation();

  useEffect(() => {
    track("view_packages", { page: "packages" });
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const sectionId = location.hash.replace("#", "");

    const timer = setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (!section) return;

      const headerOffset = 90;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <SEO
        title="Packages | KSnap Studio — Durham & GTA Photographer"
        description="Browse KSnap Studio packages for weddings, engagements, events, family sessions, portraits, and seasonal minis across Durham Region & the GTA."
        path="/packages"
      />

      <main className="packages" aria-labelledby="packages-title">
        <div className="packages__inner">
          <header className="packages__intro">
            <h1 id="packages-title" className="packages__title">
              Packages
            </h1>

            <p className="packages__intro-heading">{INTRO.heading}</p>
            <p className="packages__intro-body">{INTRO.body}</p>
          </header>

          {GROUPS_ORDER.map(({ key, icon }) => {
            const items = PACKAGES.filter((p) => p.group === key);

            if (!items.length) return null;

            return (
              <section
                id={GROUP_IDS[key]}
                className="packages__section"
                key={key}
                aria-label={key}
              >
                <h2 className="packages__section-title">
                  <span
                    className="packages__section-badge"
                    aria-hidden="true"
                  >
                    <span className="packages__section-emoji">{icon}</span>
                  </span>

                  <span>{key}</span>
                </h2>

                <ul className="packages__grid">
                  {items.map(
                    ({
                      key: packageKey,
                      icon,
                      title,
                      price,
                      tagline,
                      bullets,
                      ctaHref,
                    }) => (
                      <li className="packages__card" key={packageKey}>
                        <header className="packages__card-head">
                          <span className="packages__emoji" aria-hidden="true">
                            {icon}
                          </span>

                          <h3 className="packages__name">
                            {title}{" "}
                            <span className="packages__price">{price}</span>
                          </h3>

                          {tagline && (
                            <p className="packages__tagline">{tagline}</p>
                          )}
                        </header>

                        {bullets?.length ? (
                          <ul className="packages__bullets">
                            {bullets.map((b, i) => (
                              <li className="packages__bullet" key={i}>
                                {b}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <a
                          className="packages__btn"
                          href={ctaHref || "/contact"}
                          onClick={() =>
                            track("cta_click", {
                              location: "packages",
                              label: "book_now",
                              package_key: packageKey,
                              package_title: title,
                              package_price: price,
                            })
                          }
                        >
                          Book Now
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}