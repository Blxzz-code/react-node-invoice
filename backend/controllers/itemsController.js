const pool = require('../config/db');

// Obtener los ítems de una factura
exports.getItemsByInvoice = async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM invoice_items WHERE invoice_id = ?',
      [req.params.invoice_id]
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los ítems' });
  }
};

// Añadir ítem a factura
exports.addItem = async (req, res) => {
  const { invoice_id, description, quantity, price } = req.body;
  if (!invoice_id || !description || !quantity || !price)
    return res.status(400).json({ message: 'Faltan campos' });

  try {
    const [result] = await pool.query(
      'INSERT INTO invoice_items (invoice_id, description, quantity, price) VALUES (?, ?, ?, ?)',
      [invoice_id, description, quantity, price]
    );
    res.status(201).json({ id: result.insertId, invoice_id, description, quantity, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al añadir ítem' });
  }
};

// Eliminar ítem
exports.deleteItem = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM invoice_items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Ítem no encontrado' });
    res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar ítem' });
  }
};
