// src/components/PicTimeGallery.jsx
import { useEffect } from "react";

export default function PicTimeGallery() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://embedding.pic-time.com/pictures/scripts/compiled/artgalleryembed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // clean up when leaving the page/route
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="main__gallery-embed">
      <iframe
        id="pictimeIntegration"
        src="https://ksnapstudio.pic-time.com/client?headless=true"
        title="K.Snap Studio Client Gallery"
        loading="lazy"
        style={{ width: "100%", height: "100%", border: "0" }}
      />
    </div>
  );
}

