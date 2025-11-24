const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria
      FROM Productos p
      JOIN Categorias c ON p.categoria_id = c.id_categoria
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});


app.get("/producto/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria
      FROM Productos p
      JOIN Categorias c ON p.categoria_id = c.id_categoria
      WHERE p.id_producto = $1
    `, [id]);

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
});


app.get("/producto/:id/tallas", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT t.*
      FROM Producto_Tallas pt
      JOIN Tallas t ON pt.id_talla = t.id_talla
      WHERE pt.id_producto = $1
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tallas" });
  }
});

app.get("/producto/:id/colores", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT c.*
      FROM Producto_Colores pc
      JOIN Colores c ON pc.id_color = c.id_color
      WHERE pc.id_producto = $1
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener colores" });
  }
});


app.get("/producto/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT i.*, t.talla, c.nombre AS color
      FROM Inventario i
      JOIN Tallas t ON i.id_talla = t.id_talla
      JOIN Colores c ON i.id_color = c.id_color
      WHERE i.producto_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener stock" });
  }
});



app.get("/producto/:id/stock-especifico", async (req, res) => {
  try {
    const { id } = req.params;
    const { talla, color } = req.query;

    console.log("🔎 Buscando stock de:", { id, talla, color });

    const result = await pool.query(`
      SELECT *
      FROM Inventario
      WHERE producto_id = $1 AND id_talla = $2 AND id_color = $3
    `, [id, talla, color]);

    console.log("➡️ Resultado SQL:", result.rows);

    res.json(result.rows[0] || { stock_actual: 0 });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener stock específico" });
  }
});


// Servidor
app.listen(4000, () => {
  console.log("Servidor backend corriendo en http://localhost:4000");
});
