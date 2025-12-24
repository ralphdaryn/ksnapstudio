import PicTimeGallery from "../../components/PicTimeGallery";
import "./Gallery.scss";

export default function Gallery() {
  return (
    <main className="gallery">
      <section className="gallery__section">
        <div className="gallery__container">
          <h1 className="gallery__title">Gallery</h1>
          <p className="gallery__intro">
            A selection of recent work across weddings, events, and portraits.
          </p>

          {/* View Gallery link (opens in new tab) */}
          <a
            href="https://ksnapstudio.pic-time.com/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="gallery__link"
          >
            View Full Gallery →
          </a>

          {/* Full interactive gallery on this page (all breakpoints) */}
          <PicTimeGallery variant="full" />
        </div>
      </section>
    </main>
  );
}
