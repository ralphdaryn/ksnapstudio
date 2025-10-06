import { useState } from "react";
import "./Header.scss";
import logo from "../../assets/images/ksnap.png";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" className="header__brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="Ksnap Studio Logo" className="header__logo" />
        </a>

        <button
          className="header__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="header__burger" />
        </button>

        <nav
          id="site-nav"
          className={`header__nav ${open ? "header__nav--open" : ""}`}
        >
          <ul className="header__list">
            <li className="header__item">
              <a className="header__link" href="/">
                Home
              </a>
            </li>
            <li className="header__item">
              <a className="header__link" href="/packages">
                Packages
              </a>
            </li>
            <li className="header__item">
              <a className="header__link" href="/gallery">
                Gallery
              </a>
            </li>
            <li className="header__item">
              <a className="header__link" href="/about">
                Bio
              </a>
            </li>
            <li className="header__item">
              <a className="header__link" href="/contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;