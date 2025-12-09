// src/components/PicTimeGallery.jsx
import React from "react";

export default function PicTimeGallery({ variant = "preview" }) {
  const isPreview = variant === "preview";

  const wrapperClass = isPreview
    ? "main__gallery-embed main__gallery-embed--preview"
    : "gallery__embed";

  return (
    <div className={wrapperClass}>
      {/* MOBILE PREVIEW:
          - CSS shows this block on mobile
          - hides it on tablet/desktop
      */}
      {isPreview && <div className="main__gallery-static" aria-hidden="true" />}

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