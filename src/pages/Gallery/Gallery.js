import "./Gallery.scss";

const MOCK = [
  { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", alt: "Family outdoors" },
  { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", alt: "Balloons" },
  { id: 3, src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop", alt: "Photographer" },
];

const Gallery = () => {
  return (
    <main className="gallery">
      <div className="gallery__inner">
        <h1 className="gallery__title">Gallery</h1>
        <div className="gallery__grid">
          {MOCK.map(img => (
            <figure key={img.id} className="gallery__item">
              <img className="gallery__img" src={img.src} alt={img.alt} />
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Gallery;
