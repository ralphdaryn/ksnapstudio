// src/pages/Gallery/Gallery.jsx
import React from "react";
import PicTimeGallery from "../../components/PicTimeGallery";
import "./Gallery.scss";

export default function Gallery() {
  return (
    <main className="gallery">
      <section className="gallery__section">
        <div className="gallery__container">
          <h1 className="gallery__title">Gallery</h1>
          <p className="gallery__intro">
            Browse the full K.Snap.Studio gallery.
          </p>

          {/* Full interactive gallery on this page (all breakpoints) */}
          <PicTimeGallery variant="full" />
        </div>
      </section>
    </main>
  );
}