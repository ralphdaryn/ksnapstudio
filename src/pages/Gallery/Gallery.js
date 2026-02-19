// src/pages/Gallery/Gallery.jsx
import PicTimeGallery from "../../components/PicTimeGallery/PicTimeGallery";
import "./Gallery.scss";
import SEO from "../../components/SEO/SEO";

export default function Gallery() {
  return (
    <>
      <SEO
        title="Gallery | KSnap Studio — Durham & GTA Photographer"
        description="View wedding, engagement, event, and portrait photography from KSnap Studio across Durham Region & the GTA."
        path="/gallery"
      />

      <main className="gallery">
        <section className="gallery__section">
          <div className="gallery__container">
            <h1 className="gallery__title">Gallery</h1>
            <p className="gallery__intro">
              A selection of recent work across weddings, events, and portraits.
            </p>

            <a
              href="https://ksnapstudio.pic-time.com/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="gallery__link"
            >
              View Full Gallery →
            </a>

            <PicTimeGallery variant="full" />
          </div>
        </section>
      </main>
    </>
  );
}