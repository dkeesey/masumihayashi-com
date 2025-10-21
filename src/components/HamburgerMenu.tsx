import { useState } from "react";
import HamburgerMenuIcon from "./HamburgerMenuIcon";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    toggleMenu(); // This could later include more logic if needed
  };

  return (
    <>
      <button className="hamburger text-primary-text-primary" onClick={handleClick} aria-label="Menu">
        <HamburgerMenuIcon />
      </button>
      <ul className={`nav-links ${isOpen ? "open" : ""} text-sm`}>
        <li>
          <a href="/japanese-american-internment-camps">
            Internment Camps
          </a>
        </li>
        <li>
          <a href="/family-album-project">Family Album</a>
        </li>
        <li>
          <a href="/artist-statement">Resources</a>
        </li>
        <li>
          <a href="/links">Links</a>
        </li>
      </ul>
    </>
  );
};

export default HamburgerMenu;
