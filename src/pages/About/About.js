// src/pages/About/About.jsx
import { Link } from "react-router-dom";
import "./About.scss";
import aboutImg from "../../assets/images/about.jpg";
import SEO from "../../components/SEO/SEO";

const About = () => {
  return (
    <>
      <SEO
        title="About | KSnap Studio — Durham & GTA Photographer"
        description="Learn about KSnap Studio — story-driven photography for weddings, engagements, events, and portraits across Durham Region & the GTA."
        path="/about"
      />

      <main className="about">
        <section className="about__wrap">
          <header className="about__head">
            <h1 className="about__title">
              K.Snap.Studio – Capturing Moments, Creating Memories
            </h1>
            <p className="about__lede">
              Story-driven photography with a clean, modern touch.
            </p>
          </header>

          <div className="about__grid">
            <figure className="about__media">
              <img
                className="about__img"
                src={aboutImg}
                alt="Behind the lens with K.Snap.Studio"
                loading="eager"
                decoding="async"
              />
              <figcaption className="visually-hidden">
                K.Snap.Studio at work, capturing candid moments.
              </figcaption>
            </figure>

            <article className="about__card">
              <p className="about__text">
                Welcome! K.Snap.Studio is my passion for photography, starting
                out in 2017 and growing into a business dedicated to telling
                your story through a camera lens! What’s my niche, you ask?
                Creating & capturing beautiful moments for lifelong memories.
              </p>

              <p className="about__text">
                With a background of 12+ years in customer service and
                photography, I bring a professional yet personal touch to every
                project. I work closely with my clients to understand their
                vision and deliver photographs that exceed expectations in a
                timely manner, with updates along the way!
              </p>

              <div
                className="about__pillrow"
                role="list"
                aria-label="Focus areas"
              >
                <span className="about__pill" role="listitem">
                  Weddings
                </span>
                <span className="about__pill" role="listitem">
                  Events
                </span>
                <span className="about__pill" role="listitem">
                  Portraits
                </span>
              </div>

              <blockquote className="about__pull">
                “Let’s make magic together.”
              </blockquote>

              <div className="about__cta">
                <Link
                  className="about__btn"
                  to="/contact"
                  aria-label="Go to contact page"
                >
                  Plan Your Experience
                </Link>
              </div>

              <p className="about__signoff">
                Tell me your date and vision—I'll craft a timeline that fits.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
