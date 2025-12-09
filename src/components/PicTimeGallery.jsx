// src/components/PicTimeGallery.jsx
import React, { useCallback } from "react";

export default function PicTimeGallery({ variant = "preview" }) {
  const isPreview = variant === "preview";

  const wrapperClass = isPreview
    ? "main__gallery-embed main__gallery-embed--preview"
    : "gallery__embed";

  // On mobile preview: block page scroll if touch starts on this section
  const handleTouchMove = useCallback(
    (e) => {
      if (!isPreview) return;

      // crude "mobile" breakpoint check (matches your mixins ~< tablet)
      if (typeof window !== "undefined" && window.innerWidth >= 768) return;

      // prevent the PAGE from scrolling when swiping over the preview block
      e.preventDefault();
    },
    [isPreview]
  );

  return (
    <div className={wrapperClass} onTouchMove={handleTouchMove}>
      <iframe
        id="ksnapPicTimeFrame"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
      />
    </div>
  );
}