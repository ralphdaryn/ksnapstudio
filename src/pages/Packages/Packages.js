// src/pages/Packages/Packages.jsx
import "./Packages.scss";

/* Grouped categories only (no prices) */
const CATEGORIES = [
  {
    key: "weddings",
    title: "Weddings & Engagements",
    items: ["Half-Day Coverage", "Full-Day Coverage", "Engagement Session"],
  },
  {
    key: "family",
    title: "Family & Maternity",
    items: ["Lifestyle Family Session", "Maternity Session"],
  },
  {
    key: "events",
    title: "Events",
    items: ["Birthdays", "Bridal Showers", "Corporate Events"],
  },
  {
    key: "portraits-seasonal",
    title: "Portraits & Seasonal Sessions",
    items: ["Individual Portraits", "Couples Portraits", "Limited-Time Themes"],
  },
  {
    key: "products",
    title: "Products & Models",
    items: ["Studio Shoots", "On-Location Shoots"],
  },
];

const Packages = () => {
  return (
    <main className="packages">
      <div className="packages__inner">
        <h1 className="packages__title">Packages</h1>

        <ul className="packages__list">
          {CATEGORIES.map(({ key, title, items }) => (
            <li key={key} className="packages__card">
              <h2 className="packages__name">{title}</h2>

              {items?.length ? (
                <ul className="packages__bullets">
                  {items.map((it, i) => (
                    <li key={i} className="packages__bullet">
                      {it}
                    </li>
                  ))}
                </ul>
              ) : null}

              <a className="packages__btn" href="/contact">
                Inquire / Book
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Packages;