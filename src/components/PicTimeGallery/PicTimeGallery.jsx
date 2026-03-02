import React from "react";

// Preview images (still served by Netlify — compress these to WebP later!)
import gallery1 from "../../assets/images/gallery1.jpg";
import gallery2 from "../../assets/images/gallery2.jpg";
import gallery3 from "../../assets/images/gallery3.jpg";
import gallery4 from "../../assets/images/gallery4.jpg";
import gallery5 from "../../assets/images/gallery5.jpg";
import gallery6 from "../../assets/images/gallery6.jpg";    

export default function PicTimeGallery({ variant = "preview" }) {
  const isPreview = variant === "preview";

  const wrapperClass = isPreview
    ? "main__gallery-embed main__gallery-embed--preview"
    : "gallery__embed";

  const galleryUrl = "https://ksnapstudio.pic-time.com/portfolio";

  return (
    <div className={wrapperClass}>
      {/* MOBILE PREVIEW (unchanged) */}
      {isPreview && (
        <div className="main__gallery-static" aria-hidden="true">
          <img className="main__gallery-static-img" src={gallery1} alt="" />
          <img className="main__gallery-static-img" src={gallery2} alt="" />
          <img className="main__gallery-static-img" src={gallery3} alt="" />
        </div>
      )}

      {/* FAUX EMBED (replaces iframe) */}
      <div
        className={isPreview ? "main__gallery-embedBox" : "gallery__embedBox"}
      >
        <div className="galleryEmbed__head">
          <div className="galleryEmbed__text">
            <h3 className="galleryEmbed__title">View the Full Portfolio</h3>
            <p className="galleryEmbed__subtitle">
               A selection of recent work across weddings, events, and portraits.
            </p>
          </div>

          <a
            href={galleryUrl}
            target="_blank"
            rel="noreferrer"
            className="galleryEmbed__cta"
          >
            Open Gallery →
          </a>
        </div>

        <div className="galleryEmbed__grid">
          {[gallery1, gallery2, gallery3, gallery4, gallery5, gallery6].map((src, i) => (
            <a
              key={i}
              className="galleryEmbed__tile"
              href={galleryUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open full gallery"
            >
              <img src={src} alt={`Gallery preview ${i + 1}`} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}