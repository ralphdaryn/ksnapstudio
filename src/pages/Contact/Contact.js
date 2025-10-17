import { useMemo, useState } from "react";
import "./Contact.scss";

const SHOOT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "events", label: "Event" },
  { value: "family", label: "Family" },
  { value: "portraits", label: "Portraits" },
];

const PACKAGE_MAP = {
  wedding: [
    { value: "full-day", label: "Full Day (8–10h)" },
    { value: "half-day", label: "Half Day (4–6h)" },
    { value: "elopement", label: "Elopement (2–3h)" },
  ],
  events: [
    { value: "event-4", label: "Half Day (4h)" },
    { value: "event-8", label: "Full Day (8h)" },
  ],
  family: [
    { value: "mini-30", label: "Mini (30 min)" },
    { value: "standard-60", label: "Standard (60 min)" },
  ],
  portraits: [
    { value: "headshot", label: "Headshot" },
    { value: "creative", label: "Creative Portrait" },
    { value: "lifestyle", label: "Lifestyle" },
  ],
};

export default function Contact() {
  const [type, setType] = useState("wedding");
  const packageOptions = useMemo(() => PACKAGE_MAP[type] ?? [], [type]);
  const [pkg, setPkg] = useState(packageOptions[0]?.value || "");

  const onChangeType = (e) => {
    const next = e.target.value;
    setType(next);
    const nextPkgs = PACKAGE_MAP[next] ?? [];
    setPkg(nextPkgs[0]?.value || "");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! Your inquiry has been sent.");
  };

  return (
    <main className="contact" aria-labelledby="contact-title">
      <div className="contact__inner">
        <header className="contact__head">
          <h1 id="contact-title" className="contact__title">
            Contact / Booking
          </h1>
          <p className="contact__lede">
            Share a few details and I’ll get back to you with availability and
            next steps.
          </p>
        </header>

        <form className="contact__form" onSubmit={onSubmit} noValidate>
          {/* Shoot type + package */}
          <fieldset className="contact__section">
            <label className="contact__field">
              <span className="contact__label">I’m booking a</span>
              <select
                className="contact__input contact__select"
                value={type}
                onChange={onChangeType}
                aria-label="Shoot type"
              >
                {SHOOT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {packageOptions.length > 0 && (
              <label className="contact__field">
                <span className="contact__label">Package</span>
                <select
                  className="contact__input contact__select"
                  value={pkg}
                  onChange={(e) => setPkg(e.target.value)}
                  aria-label="Package"
                >
                  {packageOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </fieldset>

          {/* Basics — always visible */}
          <fieldset className="contact__section">
            <div className="contact__row contact__row--2">
              <label className="contact__field">
                <span className="contact__label">
                  {type === "wedding" ? "Names" : "Name"}
                </span>
                <input
                  className="contact__input"
                  type="text"
                  placeholder={
                    type === "wedding" ? "Alex & Jamie" : "Your name"
                  }
                  required
                />
              </label>

              <label className="contact__field">
                <span className="contact__label">Phone (optional)</span>
                <input
                  className="contact__input"
                  type="tel"
                  placeholder="(555) 555-5555"
                  inputMode="tel"
                />
              </label>
            </div>

            <label className="contact__field">
              <span className="contact__label">Email</span>
              <input
                className="contact__input"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="contact__field">
              <span className="contact__label">How did you hear about me?</span>
              <input
                className="contact__input"
                type="text"
                placeholder="Google, Instagram, friend, etc."
              />
            </label>
          </fieldset>

          {/* Wedding-only details (progressive disclosure) */}
          {type === "wedding" ? (
            <fieldset className="contact__section" aria-live="polite">
              <legend className="contact__section-title">
                Wedding Details
              </legend>

              <div className="contact__row contact__row--2">
                <label className="contact__field">
                  <span className="contact__label">Wedding Date</span>
                  <input className="contact__input" type="date" required />
                </label>

                <label className="contact__field">
                  <span className="contact__label">Ceremony Start Time</span>
                  <input className="contact__input" type="time" required />
                </label>
              </div>

              <label className="contact__field">
                <span className="contact__label">Getting-ready Location</span>
                <input
                  className="contact__input"
                  type="text"
                  placeholder="Hotel or address"
                />
              </label>

              <label className="contact__field">
                <span className="contact__label">Ceremony Location</span>
                <input
                  className="contact__input"
                  type="text"
                  placeholder="Venue / address"
                />
              </label>

              <label className="contact__field">
                <span className="contact__label">Reception Location</span>
                <input
                  className="contact__input"
                  type="text"
                  placeholder="Venue / address"
                />
              </label>
            </fieldset>
          ) : (
            <fieldset className="contact__section">
              <label className="contact__field">
                <span className="contact__label">Notes (optional)</span>
                <textarea
                  className="contact__textarea"
                  rows={4}
                  placeholder="Share vibe, ideas, or date preferences…"
                />
              </label>
            </fieldset>
          )}

          <div className="contact__meta">
            <p className="contact__note">
              I typically respond within 24–48 hours.
            </p>
          </div>

          <button
            className="contact__btn"
            type="submit"
            aria-label="Send inquiry"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}