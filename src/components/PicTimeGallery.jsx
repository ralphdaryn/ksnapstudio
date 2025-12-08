// src/components/PicTimeGallery.jsx
import React from "react";

export default function PicTimeGallery({ variant = "preview" }) {
  const wrapperClass =
    variant === "full"
      ? "gallery__embed"
      : "main__gallery-embed main__gallery-embed--preview";

  return (
    <div className={wrapperClass}>
      <iframe
        id="ksnapPicTimeFrame"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
      />
    </div>
  );
}