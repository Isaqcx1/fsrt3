import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Carrito() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  if (cart.length === 0)
    return <h2 style={{ textAlign: "center" }}>Carrito vacío</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Carrito de Compras ({cart.length} productos)</h2>

      {cart.map((item, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
          
          <h3>{item.nombre}</h3>

          <p><b>Talla:</b> {item.talla}</p>
          <p><b>Color:</b> {item.color}</p>
          <p><b>Cantidad:</b> {item.cantidad}</p>
          <p><b>Precio unitario:</b> S/ {item.precio}</p>
          <p><b>Subtotal:</b> S/ {item.precio * item.cantidad}</p>

          <button onClick={() => removeFromCart(index)}>
            Quitar
          </button>
        </div>
      ))}

      <h3>Total: S/ {total}</h3>

      <Link to="/checkout">
        <button style={{ padding: 10, marginTop: 20 }}>
          Continuar Compra
        </button>
      </Link>
    </div>
  );
}

export default Carrito;
