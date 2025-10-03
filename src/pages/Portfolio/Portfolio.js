import "./Portfolio.scss";

const MOCK = [
  { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", alt: "Family outdoors" },
  { id: 2, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", alt: "Balloons" },
  { id: 3, src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop", alt: "Photographer" },
];

const Portfolio = () => {
  return (
    <main className="portfolio">
      <div className="portfolio__inner">
        <h1 className="portfolio__title">Portfolio</h1>
        <div className="portfolio__grid">
          {MOCK.map(img => (
            <figure key={img.id} className="portfolio__item">
              <img className="portfolio__img" src={img.src} alt={img.alt} />
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Portfolio;
