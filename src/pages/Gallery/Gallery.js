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
            <div className="gallery__head">
              <div>
                <h1 className="gallery__title">Gallery</h1>
              </div>
            </div>

            <PicTimeGallery variant="full" />
          </div>
        </section>
      </main>
    </>
  );
}
