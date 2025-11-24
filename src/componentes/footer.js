import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="logo-section">
        <h2>URBAN VIBE</h2>
        <p>STREETWEAR</p>
      </div>

      <nav className="footer-nav">
        <Link to="/">INICIO</Link>
        <Link to="/catalogo">CATÁLOGO</Link>
        <Link to="/info">INFO</Link>
      </nav>

      <div className="footer-icons">
        <span>IG</span>
        <span>FB</span>
        <Link to="/carrito">CARRITO</Link>
      </div>
    </footer>
  );
}

export default Footer;
