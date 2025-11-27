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




app.post("/pedidos", async (req, res) => {
  try {
    const { cliente_nombre, cliente_email, direccion, telefono, total } = req.body;

    const result = await pool.query(
      `INSERT INTO Pedidos (cliente_nombre, cliente_email, direccion, telefono, estado, total)
       VALUES ($1, $2, $3, $4, 'Pendiente', $5)
       RETURNING id_pedido`,
      [cliente_nombre, cliente_email, direccion, telefono, total]
    );

    res.json({
      success: true,
      pedido_id: result.rows[0].id_pedido
    });

  } catch (error) {
    console.error("❌ ERROR EN /pedidos:", error);
    res.status(500).json({ success: false, message: "Error al registrar pedido" });
  }
});


app.post("/pedido-completar", async (req, res) => {
  const client = await pool.connect();

  try {
    const { pedido_id, items, metodo_pago, total } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "El campo 'items' debe ser un arreglo."
      });
    }

    await client.query("BEGIN");

    for (const item of items) {
      const productoId = item.id_producto || item.id;
      const tallaNombre = item.talla;
      const colorNombre = item.color;
      const cantidad = item.cantidad;
      const precio = item.precio;

      if (!productoId || !tallaNombre || !colorNombre || !cantidad || !precio) {
        return res.status(400).json({
          success: false,
          message: "Faltan datos en un item",
          item
        });
      }

      
      const tallaRes = await client.query(
        `SELECT id_talla FROM Tallas WHERE talla = $1`,
        [tallaNombre]
      );

      if (tallaRes.rows.length === 0)
        throw new Error(`No existe la talla '${tallaNombre}'`);

      const tallaId = tallaRes.rows[0].id_talla;

      
      const colorRes = await client.query(
        `SELECT id_color FROM Colores WHERE nombre = $1`,
        [colorNombre]
      );

      if (colorRes.rows.length === 0)
        throw new Error(`No existe el color '${colorNombre}'`);

      const colorId = colorRes.rows[0].id_color;

      
      await client.query(
        `INSERT INTO Detalle_Pedido 
             (pedido_id, producto_id, id_talla, id_color, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          pedido_id,
          productoId,
          tallaId,
          colorId,
          cantidad,
          precio
        ]
      );

     
      await client.query(
        `UPDATE Inventario 
         SET stock_actual = stock_actual - $1
         WHERE producto_id = $2 AND id_talla = $3 AND id_color = $4`,
        [cantidad, productoId, tallaId, colorId]
      );
    }

    
    await client.query(
      `INSERT INTO Pagos (pedido_id, metodo_pago, monto)
       VALUES ($1, $2, $3)`,
      [pedido_id, metodo_pago, total]
    );

    await client.query("COMMIT");

    res.json({ success: true });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ ERROR pedido-completar:", error);
    res.status(500).json({ success: false, message: "Error al completar pedido" });
  } finally {
    client.release();
  }
});












// Servidor
app.listen(4000, () => {
  console.log("Servidor backend corriendo en http://localhost:4000");
});
