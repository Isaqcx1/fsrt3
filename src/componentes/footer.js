import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer-container">

      <div className="footer-inner">

        
        <div className="footer-logo">
          <Link to="/login" className="logo-link">
            <img
              src="/imgs/UrbanVibeL.png"
              alt="Urban Vibe"
              className="logo-img"
            />
          </Link>
        </div>

       
        <nav className="footer-nav">
          <Link to="/" className="nav-item">INICIO</Link>
          <Link to="/catalogo" className="nav-item">CATÁLOGO</Link>
          <Link to="/info" className="nav-item">INFO</Link>
        </nav>

        
        <div className="footer-icons">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src="/imgs/ig.png" alt="Instagram" className="icon-img" />
          </a>

          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="/imgs/fb.png" alt="Facebook" className="icon-img" />
          </a>

           <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <img src="/imgs/x.png" alt="Twitter" className="icon-img" />
        </a>

          <Link to="/carrito" className="cart-icon">
            <img src="/imgs/carrito.png" alt="Twitter" className="icon-img" />
          </Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;


