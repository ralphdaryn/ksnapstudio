import { Link } from "react-router-dom";
import "./Main.scss";

// Put your real links here when ready:
const SMUGMUG_URL = ""; // e.g., "https://ksnapstudio.smugmug.com"
const GOOGLE_REVIEW_URL = ""; // e.g., "https://g.page/r/xxxxxxx/review"

// Package categories (no prices per client request)
const PACKAGE_CATEGORIES = [
  {
    key: "weddings",
    title: "Weddings",
    items: ["Half-Day Coverage", "Full-Day Coverage"],
  },
  {
    key: "events",
    title: "Events",
    items: ["Birthdays", "Bridal Showers", "Corporate Events"],
  },
  {
    key: "portraits",
    title: "Portraits",
    items: ["Individual Sessions", "Couple Sessions"],
  },
  {
    key: "seasonal",
    title: "Seasonal Portrait Sessions",
    items: ["Limited-time themed shoots (e.g., holidays)"],
  },
  {
    key: "family",
    title: "Family / Engagement / Maternity",
    items: ["Lifestyle-focused sessions"],
  },
  {
    key: "products",
    title: "Products / Models",
    items: ["Studio or on-location shoots"],
  },
];

// Sample images (replace with your assets)
const PORTFOLIO_SAMPLE = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    alt: "Wedding moment",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    alt: "Event details",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait scene",
  },
];

const FAQ = [
  {
    q: "Do you need a deposit to save our date?",
    a: "Yes, a 25% deposit secures your spot.",
  },
  { q: "What about props?", a: "Props are welcome — champagne included!" },
  {
    q: "Can I request a style?",
    a: "Absolutely, everything is customized to your vibe.",
  },
  {
    q: "How long will it take to get my photos?",
    a: "Weddings: 6–8 weeks. Portraits/Events: 2–3 weeks.",
  },
  {
    q: "What happens if the weather doesn’t cooperate?",
    a: "We can reschedule or adapt indoors.",
  },
  {
    q: "What’s included in my package?",
    a: "Professional edits, private gallery, consultation, and more.",
  },
];

const TESTIMONIALS = [
  {
    text: "We are soooooo obsessed!!! These photos are so bright and airy, and truly in the moment. Thank you for doing such an amazing job — these memories will last forever!",
  },
  {
    text: "From the moment I met Kishan, my anxiety disappeared. He made me feel comfortable, directed me with ease, and turned my wedding anniversary photos into a dreamy highlight of my year.",
  },
];

export default function Main() {
  return (
    <main className="main">
      {/* HERO */}
      <section className="main__hero">
        <div className="main__container">
          <h1 className="main__title">K.Snap.Studio</h1>
          <p className="main__tagline">Capturing Moments, Creating Memories</p>
          <p className="main__subtitle">
            Weddings • Events • Portraits — serving the GTA with a modern,
            story-driven approach.
          </p>
          <div className="main__cta">
            <Link className="main__btn main__btn--primary" to="/packages">
              View Packages
            </Link>
            <Link className="main__btn" to="/contact">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* BIO (Intro) */}
      <section id="bio" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">About KSnap Studio</h2>
          <p className="main__text">
            Welcome! K.Snap.Studio is my passion for photography — from 2017 to
            today — focused on telling your story through the lens. My niche?
            Creating &amp; capturing beautiful moments for lifelong memories.
            With 12+ years of customer service and photography, I bring a
            professional yet personal touch to every project. I work closely
            with clients to understand their vision and deliver photographs that
            exceed expectations — with updates and timely delivery.
          </p>
          <p className="main__text main__text--em">
            Let’s make magic together.
          </p>
          <Link className="main__link" to="/bio">
            Read full bio →
          </Link>
        </div>
      </section>

      {/* PACKAGES PREVIEW (no prices) */}
      <section id="packages" className="main__section">
        <div className="main__container">
          <h2 className="main__section-title">Packages</h2>

          <ul className="main__cards">
            {PACKAGE_CATEGORIES.map(({ key, title, items }) => (
              <li key={key} className="main__card">
                <h3 className="main__card-title">{title}</h3>
                <ul className="main__card-list">
                  {items.map((t, i) => (
                    <li key={i} className="main__card-item">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="main__card-note">
                  Add-ons: extra hours, second shooter, videographer —{" "}
                  <span>inquire for options</span>.
                </div>
                <Link className="main__card-btn" to="/contact">
                  Book Now
                </Link>
              </li>
            ))}
          </ul>

          <Link className="main__link" to="/packages">
            See full details →
          </Link>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section id="portfolio" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">Portfolio</h2>

          <div className="main__media-list">
            {PORTFOLIO_SAMPLE.map((img) => (
              <figure key={img.id} className="main__media">
                <img
                  className="main__img"
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          <div className="main__links">
            <Link className="main__link" to="/portfolio">
              View full gallery →
            </Link>
            {SMUGMUG_URL ? (
              <a
                className="main__link"
                href={SMUGMUG_URL}
                target="_blank"
                rel="noreferrer"
              >
                Open SmugMug Portfolio ↗
              </a>
            ) : (
              <button
                className="main__link main__link--button"
                type="button"
                disabled
                title="Link coming soon"
              >
                Open SmugMug Portfolio ↗
              </button>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS + TESTIMONIALS (combined) */}
      <section id="reviews" className="main__section">
        <div className="main__container">
          <h2 className="main__section-title">
            Reviews &amp; What Clients Say
          </h2>

          <div className="main__reviews">
            <div className="main__reviews-cta">
              {GOOGLE_REVIEW_URL ? (
                <a
                  className="main__btn main__btn--outline"
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Leave a Google Review
                </a>
              ) : (
                <button
                  className="main__btn main__btn--outline"
                  type="button"
                  disabled
                  title="Link coming soon"
                >
                  Leave a Google Review
                </button>
              )}
              <p className="main__reviews-note">
                We value every story. Share yours or browse what others loved.
              </p>
            </div>

            <ul className="main__quotes">
              {TESTIMONIALS.map((t, i) => (
                <li key={i} className="main__quote">
                  <blockquote className="main__quote-text">
                    “{t.text}”
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">FAQ</h2>
          <div className="main__accordion">
            {FAQ.map(({ q, a }, i) => (
              <details key={i} className="main__faq">
                <summary className="main__faq-q">{q}</summary>
                <p className="main__faq-a">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT TEASER */}
      <section id="contact" className="main__section main__section--cta">
        <div className="main__container">
          <h2 className="main__section-title">Ready to book?</h2>
          <p className="main__text">
            Share your date, locations, and vision. We’ll recommend the perfect
            package and timeline.
          </p>
        </div>
        <div className="main__container">
          <Link className="main__btn main__btn--primary" to="/contact">
            Contact / Booking
          </Link>
        </div>
      </section>
    </main>
  );
}