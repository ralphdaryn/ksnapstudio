// =====================
// src/pages/Gallery/Gallery.jsx
// =====================
import "./Gallery.scss";
import PicTimeGallery from "../../components/PicTimeGallery";

export default function Gallery() {
  return (
    <main className="gallery">
      <div className="gallery__frame">
        <PicTimeGallery />
      </div>
    </main>
  );
}
