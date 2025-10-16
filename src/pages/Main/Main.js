import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.scss";

// Hero & testimonial images (inside src/assets/images)
import hero1 from "../../assets/images/hero1.jpg";
import hero2 from "../../assets/images/hero2.jpg";
import hero3 from "../../assets/images/hero3.jpg";
import testi1 from "../../assets/images/testimonial1.jpg";
import testi2 from "../../assets/images/testimonial2.jpg";
import gp1 from "../../assets/images/gallery1.jpg";
import gp2 from "../../assets/images/gallery2.jpg";
import gp3 from "../../assets/images/gallery3.jpg";

const HERO_SLIDES = [hero1, hero2, hero3];

// Using imported images for preview (no /public paths)
const GALLERY_PREVIEW = [
  { id: 1, src: gp1, alt: "Wedding candid" },
  { id: 2, src: gp2, alt: "Event details" },
  { id: 3, src: gp3, alt: "Portrait moment" },
];

const PACKAGE_CATEGORIES = [
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
    key: "events",
    title: "Events",
    items: ["Birthdays", "Bridal Showers", "Corporate Events"],
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

export default function Main() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [fitModes, setFitModes] = useState(
    Array(HERO_SLIDES.length).fill("cover")
  );

  useEffect(() => {
    const id = setInterval(
      () => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loaders = HERO_SLIDES.map(
      (src, idx) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve({ idx, w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ idx, w: 0, h: 0 });
          img.src = src;
        })
    );

    Promise.all(loaders).then((results) => {
      if (!isMounted) return;
      const modes = Array(HERO_SLIDES.length).fill("cover");
      results.forEach(({ idx, w, h }) => {
        if (!w || !h) return;
        const ar = w / h;
        if (ar < 0.95 || ar > 2.0) modes[idx] = "contain";
      });
      setFitModes(modes);
    });

    return () => {
      isMounted = false;
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
            <Link className="main__btn main__btn--primary" to="/packages">
              View Packages
            </Link>
            <Link className="main__btn" to="/contact">
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
                role="tab"
                aria-selected={i === heroIndex}
                aria-label={`Go to slide ${i + 1}`}
                className={`main__hero-dot ${
                  i === heroIndex ? "main__hero-dot--active" : ""
                }`}
                onClick={() => goTo(i)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {/* BIO */}
      <section id="about" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">About KSnap Studio</h2>
          <p className="main__text">
            Welcome! K.Snap.Studio is my passion for photography — from 2017 to
            today — focused on telling your story through the lens. With 12+
            years of customer service and photography, I bring a professional
            yet personal touch to every project.
          </p>
          <p className="main__text main__text--em">
            Let’s make magic together.
          </p>
          <Link className="main__link" to="/about">
            Read full bio →
          </Link>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW (using imported images) */}
      <section id="gallery" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">Gallery</h2>

          <div className="main__media-list main__media-list--gallery">
            {GALLERY_PREVIEW.map((p) => (
              <figure key={p.id} className="main__media">
                <img
                  className="main__img"
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="visually-hidden">{p.alt}</figcaption>
              </figure>
            ))}
          </div>

          <div className="main__links">
            <Link className="main__link" to="/gallery">
              View full gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS (unchanged testimonial image + captions) */}
      <section id="reviews" className="main__section">
        <div className="main__container">
          <h2 className="main__section-title">
            Reviews &amp; What Clients Say
          </h2>

          <div className="main__reviews">
            <ul className="main__quotes">
              {TESTIMONIALS.map((t) => (
                <li key={t.id} className="main__quote">
                  <figure className="main__tcard">
                    <img
                      src={t.img}
                      alt={t.alt}
                      className="main__tcard-img"
                      loading="eager"
                    />
                    <span aria-hidden="true" className="main__tcard-quote">
                      &#8220;
                    </span>
                    <figcaption className="main__tcard-body">
                      <blockquote className="main__quote-text">
                        “{t.text}”
                      </blockquote>
                      <div className="main__quote-meta">— {t.name}</div>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PACKAGES PREVIEW (no prices) */}
      <section id="packages" className="main__section">
        <div className="main__container">
          <div className="main__section-head">
            <h2 className="main__section-title">Packages</h2>
            <Link className="main__link main__link--inline" to="/packages">
              See full details →
            </Link>
          </div>

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
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="main__section main__section--alt">
        <div className="main__container">
          <h2 className="main__section-title">FAQ</h2>
          <div className="main__accordion">
            {[
              {
                q: "Do you need a deposit to save our date?",
                a: "Yes, a 25% deposit secures your spot.",
              },
              {
                q: "What about props?",
                a: "Props are welcome — champagne included!",
              },
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
            ].map(({ q, a }, i) => (
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
