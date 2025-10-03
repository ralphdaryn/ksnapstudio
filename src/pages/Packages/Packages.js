// src/pages/Packages/Packages.jsx
import "./Packages.scss";

const PACKAGES = [
  {
    name: "Starter",
    price: "$199",
    desc: "30-minute session • 10 edited photos",
  },
  {
    name: "Standard",
    price: "$399",
    desc: "1-hour session • 25 edited photos",
  },
  { name: "Premium", price: "$699", desc: "2-hour session • 50 edited photos" },
];

const Packages = () => {
  return (
    <main className="packages">
      <div className="packages__inner">
        <h1 className="packages__title">Packages</h1>
        <ul className="packages__list">
          {PACKAGES.map((p) => (
            <li key={p.name} className="packages__card">
              <h2 className="packages__name">{p.name}</h2>
              <div className="packages__price">{p.price}</div>
              <p className="packages__desc">{p.desc}</p>
              <a className="packages__btn" href="/contact">
                Book Now
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};
export default Packages;