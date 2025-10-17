// src/components/Footer/Footer.js
import "./Footer.scss";

export default function Footer() {
  const YEAR = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* Social (clean, centered) */}
      <div className="footer__container">
        <div className="footer__social" aria-label="Social media">
          <a
            className="footer__icon"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
              />
              <circle
                cx="12"
                cy="12"
                r="4.5"
                fill="none"
                stroke="currentColor"
              />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
          </a>

          <a
            className="footer__icon"
            href="mailto:hello@ksnap.studio"
            aria-label="Email"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                fill="none"
                stroke="currentColor"
              />
              <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" />
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="footer__divider" />

      {/* Legal */}
      <div className="footer__container footer__legal">
        <p className="footer__copy">
          © {YEAR} K.Snap.Studio · All rights reserved
        </p>
        <p className="footer__small">
          Serving the GTA · Weddings · Events · Portraits
        </p>
      </div>
    </footer>
  );
}