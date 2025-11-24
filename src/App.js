import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./paginas/inicio.js";
import Catalogo from "./paginas/catalogo.js";
import RopaInfo from "./paginas/ropainfo.js";
import Carrito from "./paginas/carrito.js";  
import Footer from "./componentes/footer.js";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Footer />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/ropainfo/:id" element={<RopaInfo />} />

          
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
