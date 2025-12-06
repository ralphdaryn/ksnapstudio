// src/components/PicTimeGallery.jsx
import React from "react";

export default function PicTimeGallery({ variant = "preview" }) {
  const wrapperClass =
    variant === "full"
      ? "gallery__embed"
      : "main__gallery-embed main__gallery-embed--preview";

  return (
    <div
      className={wrapperClass}
      style={{
        height: "1100px", // adjust if you want more/less visible gallery
      }}
    >
      <iframe
        id="pictimeIntegration"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
      />
    </div>
  );
}