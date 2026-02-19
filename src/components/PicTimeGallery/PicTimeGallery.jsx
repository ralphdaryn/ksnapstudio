// src/components/PicTimeGallery.jsx
import React from "react";

// Mobile preview images (put these in: src/assets/images/)
import gallery1 from "../../assets/images/gallery1.jpg";
import gallery2 from "../../assets/images/gallery2.jpg";
import gallery3 from "../../assets/images/gallery3.jpg";

export default function PicTimeGallery({ variant = "preview" }) {
  const isPreview = variant === "preview";

  const wrapperClass = isPreview
    ? "main__gallery-embed main__gallery-embed--preview"
    : "gallery__embed";

  return (
    <div className={wrapperClass}>
      {/* MOBILE PREVIEW:
          - shows on mobile
          - hides on tablet/desktop
      */}
      {isPreview && (
        <div className="main__gallery-static" aria-hidden="true">
          <img className="main__gallery-static-img" src={gallery1} alt="" />
          <img className="main__gallery-static-img" src={gallery2} alt="" />
          <img className="main__gallery-static-img" src={gallery3} alt="" />
        </div>
      )}

      {/* IFRAME:
          - hidden on mobile for PREVIEW via CSS
          - visible and interactive on tablet/desktop
          - always visible for FULL (gallery page)
      */}
      <iframe
        className={isPreview ? "main__gallery-iframe" : ""}
        id="ksnapPicTimeFrame"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
      />
    </div>
  );
}