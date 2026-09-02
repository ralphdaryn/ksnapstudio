// import { useState } from "react";
// import "./Header.scss";
// import logo from "../../assets/images/ksnap.png";

// const Header = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="header">
//       <div className="header__inner">
//         <a href="/" className="header__brand" onClick={() => setOpen(false)}>
//           <img src={logo} alt="Ksnap Studio Logo" className="header__logo" />
//         </a>

//         <button
//           className="header__toggle"
//           aria-label="Toggle navigation"
//           aria-expanded={open}
//           aria-controls="site-nav"
//           onClick={() => setOpen((v) => !v)}
//         >
//           <span className="header__burger" />
//         </button>

//         <nav
//           id="site-nav"
//           className={`header__nav ${open ? "header__nav--open" : ""}`}
//         >
//           <ul className="header__list">
//             <li className="header__item">
//               <a className="header__link" href="/">
//                 Home
//               </a>
//             </li>
//             <li className="header__item">
//               <a className="header__link" href="/packages">
//                 Packages
//               </a>
//             </li>
//             <li className="header__item">
//               <a className="header__link" href="/gallery">
//                 Gallery
//               </a>
//             </li>
//             <li className="header__item">
//               <a className="header__link" href="/about">
//                 About
//               </a>
//             </li>
//             <li className="header__item">
//               <a className="header__link" href="/contact">
//                 Contact
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState } from "react";

import "./Header.scss";

import logoMobile from "../../assets/images/logo-mobile.jpeg";
import logoDesktop from "../../assets/images/logo-desktop.jpeg";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a
          href="/"
          className="header__brand"
          onClick={() => setOpen(false)}
        >
          <picture className="header__brand-picture">
            <source media="(min-width: 768px)" srcSet={logoDesktop} />

            <img
              src={logoMobile}
              alt="Ksnap Studio Logo"
              className="header__logo"
            />
          </picture>
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
                About
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