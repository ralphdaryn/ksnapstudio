// =====================
// src/pages/Gallery/Gallery.jsx
// =====================
import { useEffect, useState, useCallback } from "react";
import "./Gallery.scss";

// Put original JPGs in src/assets/gallery/
import g1 from "../../assets/images/gallery1.jpg";
import g2 from "../../assets/images/gallery2.jpg";
import g3 from "../../assets/images/gallery3.jpg";
import g4 from "../../assets/images/gallery4.jpg";
import g5 from "../../assets/images/gallery5.jpg";
import g6 from "../../assets/images/gallery6.jpg";
import g7 from "../../assets/images/gallery7.jpg";
import g8 from "../../assets/images/gallery8.jpg";

// If you know each image’s aspect ratio, add it; otherwise default 4/3
const PHOTOS = [
  { id: 1, src: g1, alt: "Gallery photo 1", ar: "4 / 3" },
  { id: 2, src: g2, alt: "Gallery photo 2", ar: "3 / 4" },
  { id: 3, src: g3, alt: "Gallery photo 3", ar: "4 / 3" },
  { id: 4, src: g4, alt: "Gallery photo 4", ar: "16 / 9" },
  { id: 5, src: g5, alt: "Gallery photo 5", ar: "3 / 4" },
  { id: 6, src: g6, alt: "Gallery photo 6", ar: "4 / 3" },
  { id: 7, src: g7, alt: "Gallery photo 7", ar: "1 / 1" },
  { id: 8, src: g8, alt: "Gallery photo 8", ar: "4 / 3" },
];

export default function Gallery() {
  const [active, setActive] = useState(null);

  const onKey = useCallback(
    (e) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft")
        setActive((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    },
    [active]
  );

  useEffect(() => {
    if (active === null) return;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onKey]);

  return (
    <main className="gallery">
      <div className="gallery__inner">
        <header className="gallery__head">
          <h1 className="gallery__title">Gallery</h1>
        </header>

        <div className="gallery__grid">
          {PHOTOS.map((p, i) => (
            <figure
              key={p.id}
              className="gallery__item"
              style={{ aspectRatio: p.ar }}
            >
              <button
                className="gallery__button"
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Open image ${i + 1} in lightbox`}
              >
                <img
                  className="gallery__img"
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setActive(null)}
        >
          <div className="lb__inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lb__close"
              onClick={() => setActive(null)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <button
              className="lb__nav lb__nav--prev"
              onClick={() =>
                setActive((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
              }
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="lb__nav lb__nav--next"
              onClick={() => setActive((i) => (i + 1) % PHOTOS.length)}
              aria-label="Next image"
            >
              ›
            </button>

            <img
              className="lb__img"
              src={PHOTOS[active].src}
              alt={PHOTOS[active].alt}
            />
            <figcaption className="lb__cap">
              {active + 1} / {PHOTOS.length}
            </figcaption>
          </div>
        </div>
      )}
    </main>
  );
}