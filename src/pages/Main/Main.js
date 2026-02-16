// src/pages/Main/Main.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.scss";
import PicTimeGallery from "../../components/PicTimeGallery";
import hero1 from "../../assets/images/hero1.jpg";
import hero2 from "../../assets/images/hero2.jpg";
import hero3 from "../../assets/images/hero3.jpg";
import testi1 from "../../assets/images/testimonial1.jpg";
import testi2 from "../../assets/images/testimonial2.jpg";
import aboutImg from "../../assets/images/about.jpg";

const HERO_SLIDES = [hero1, hero2, hero3];

const PACKAGE_CATEGORIES = [
  {
    key: "events",
    title: "Events",
    items: ["Birthdays", "Bridal Showers", "Corporate Events"],
  },
  {
    key: "weddings",
    title: "Weddings & Engagements",
    items: ["Half-Day Coverage", "Full-Day Coverage", "Engagement Session"],
  },
  {
    key: "family",
    title: "Family & Maternity",
    items: ["Lifestyle Family Session", "Maternity Session"],
  },
  {
    key: "portraits-seasonal",
    title: "Portraits & Seasonal Sessions",
    items: [
      "Individual Portraits",
      "Couples Portraits",
      "Limited-Time Themed Shoots",
    ],
  },
];

const TESTIMONIALS = [
  {
    id: "celina",
    name: "Celina",
    text: "We are soooooo obsessed!!! These photos are so bright and airy, and truly in the moment. Thank you for doing such an amazing job — these memories will last forever!",
    img: testi1,
    alt: "Celina portrait for testimonial",
  },
  {
    id: "m-and-l",
    name: "M & L",
    text: "From the moment I met Kishan, my anxiety disappeared. He made me feel comfortable, directed me with ease, and turned my wedding anniversary photos into a dreamy highlight of my year.",
    img: testi2,
    alt: "M & L close-up under the veil",
  },
];

// ✅ GA4 event helper (safe + no install needed)
const track = (eventName, params = {}) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    // fail silently
  }
};

export default function Main() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [fitModes, setFitModes] = useState(
    Array(HERO_SLIDES.length).fill("cover"),
  );

  // Auto-advance hero slides
  useEffect(() => {
    const id = setInterval(
      () => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  // Detect aspect ratios (contain for extreme aspect ratios)
  useEffect(() => {
    let mounted = true;

    const loaders = HERO_SLIDES.map(
      (src, idx) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve({ idx, w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ idx, w: 0, h: 0 });
          img.src = src;
        }),
    );

    Promise.all(loaders).then((results) => {
      if (!mounted) return;
      const modes = Array(HERO_SLIDES.length).fill("cover");

      results.forEach(({ idx, w, h }) => {
        if (!w || !h) return;
        const ar = w / h;
        if (ar < 0.95 || ar > 2.0) modes[idx] = "contain";
      });

      setFitModes(modes);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const goTo = (idx) => setHeroIndex(idx % HERO_SLIDES.length);

  return (
    <main className="main">
      {/* HERO */}
      <section className="main__hero">
        <div className="main__hero-carousel" aria-hidden="true">
          {HERO_SLIDES.map((src, idx) => (
            <div
              key={idx}
              className={`main__hero-slide ${
                idx === heroIndex ? "main__hero-slide--active" : ""
              } ${
                fitModes[idx] === "contain" ? "main__hero-slide--contain" : ""
              }`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        <div className="main__container">
          <h1 className="main__title">K.Snap.Studio</h1>
          <p className="main__tagline">Capturing Moments, Creating Memories</p>
          <p className="main__subtitle">
            Weddings • Events • Portraits — serving the GTA with a modern,
            story-driven approach.
          </p>

          <div className="main__cta">
            <Link
              className="main__btn main__btn--primary"
              to="/packages"
              onClick={() =>
                track("cta_click", { location: "hero", label: "view_packages" })
              }
            >
              View Packages
            </Link>
            <Link
              className="main__btn"
              to="/contact"
              onClick={() =>
                track("cta_click", { location: "hero", label: "book_now" })
              }
            >
              Book Now
            </Link>
          </div>

          <div
            className="main__hero-dots"
            role="tablist"
            aria-label="Hero slides"
          >
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`main__hero-dot ${
                  i === heroIndex ? "main__hero-dot--active" : ""
                }`}
                onClick={() => goTo(i)}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section id="about" className="main__section">
        <div className="main__container">
          <div className="main__section-head">
            <h2 className="main__section-title">About</h2>
            <Link className="main__link main__link--inline" to="/about">
              Learn more →
            </Link>
          </div>

          <div className="main__about">
            <figure className="main__about-media">
              <img
                className="main__about-img"
                src={aboutImg}
                alt="Behind the lens with K.Snap.Studio"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <article className="main__about-card">
              <p className="main__about-text">
                Welcome! K.Snap.Studio is my passion for photography starting
                out in 2017 to business owner in telling your story through a
                camera lens. My niche is creating &amp; capturing beautiful
                moments for lifelong memories.
              </p>

              <div
                className="main__about-pills"
                role="list"
                aria-label="Focus areas"
              >
                <span className="main__about-pill" role="listitem">
                  Weddings
                </span>
                <span className="main__about-pill" role="listitem">
                  Events
                </span>
                <span className="main__about-pill" role="listitem">
                  Portraits
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="main__section main__section--alt">
        <div className="main__container">
          <div className="main__section-head">
            <h2 className="main__section-title">Gallery</h2>

            <a
              className="main__link main__link--inline"
              href="https://ksnapstudio.pic-time.com/portfolio"
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                track("portfolio_click", {
                  location: "home_gallery_section",
                  destination: "pictime_portfolio",
                })
              }
            >
              View Portfolio →
            </a>
          </div>

          <PicTimeGallery variant="preview" />
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section id="packages" className="main__section">
        <div className="main__container">
          <div className="main__section-head">
            <h2 className="main__section-title">Packages</h2>
            <Link className="main__link main__link--inline" to="/packages">
              View all →
            </Link>
          </div>

          <ul className="main__cards">
            {PACKAGE_CATEGORIES.map((cat) => (
              <li className="main__card" key={cat.key}>
                <h3 className="main__card-title">{cat.title}</h3>

                <ul className="main__card-list">
                  {cat.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p className="main__card-note">
                  See full pricing &amp; details on the Packages page.
                </p>

                <Link
                  className="main__card-btn"
                  to="/packages"
                  onClick={() =>
                    track("packages_preview_click", {
                      location: "home_packages_preview",
                      category: cat.key,
                    })
                  }
                >
                  View Packages
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="main__section">
        <div className="main__container">
          <div className="main__reviewsWrap">
            <h2 className="main__section-title">Reviews & Testimonials</h2>

            <ul className="main__reviewsList">
              {TESTIMONIALS.map((t) => (
                <li key={t.id} className="main__reviewsItem">
                  <figure className="main__tcard">
                    <img className="main__tcard-img" src={t.img} alt={t.alt} />
                    <span className="main__tcard-quote" aria-hidden="true">
                      “
                    </span>

                    <figcaption className="main__tcard-body">
                      <blockquote className="main__quote-text">
                        {t.text}
                      </blockquote>
                      <div className="main__quote-meta">— {t.name}</div>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>

            {/* Google Reviews CTA */}
            <div className="main__reviewsCta" aria-label="External reviews">
              <p className="main__reviewsNote">
                See why clients love K.Snap.Studio — real stories, real moments.
              </p>

              <a
                className="main__btn main__btn--outline main__btn--google"
                href="https://www.google.com/maps/place/K_Snap.Photography/@44.0187004,-78.981649,9z/data=!3m1!4b1!4m6!3m5!1s0x2c5016303d7b7473:0x9bfff2c50f0016fe!8m2!3d44.0187004!4d-78.981649!16s%2Fg%2F11vxpp4x7z?entry=ttu&g_ep=EgoyMDI1MTAxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  track("google_reviews_click", {
                    location: "reviews_section",
                    destination: "google_maps_reviews",
                  })
                }
              >
                <svg
                  className="btn-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="currentColor"
                  />
                  <path
                    d="M12 7.5c2 0 3.5 1.2 3.5 3h-3.2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 12a4 4 0 1 1-1.2-2.9"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
                View Google Reviews →
              </a>

              <p className="main__reviewsFyi">Rated 5.0 ★ by clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="main__section main__section--cta">
        <div className="main__container">
          <h2 className="main__section-title">
            Let's capture something beautiful.
          </h2>
          <p className="main__text">
            Share your date, locations, and vision. We’ll recommend the perfect
            package and timeline.
          </p>
          <Link className="main__btn main__btn--primary" to="/contact">
            Plan Your Experience
          </Link>
        </div>
      </section>
    </main>
  );
}