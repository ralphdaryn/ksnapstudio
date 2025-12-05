// src/components/PicTimeGallery.jsx
import React from "react";

export default function PicTimeGallery() {
  return (
    <div
      className="main__gallery-embed"
      style={{
        height: "1100px", // tweak this: 900px, 1200px, etc.
      }}
    >
      <iframe
        id="pictimeIntegration"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          border: "0",
        }}
      />
    </div>
  );
}