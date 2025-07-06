const pool = require('../config/db');
exports.getInvoices = async (req, res) => {
  const { clientId } = req.query;

  try {
    let query = `
      SELECT invoices.*, clients.name AS client_name
      FROM invoices
      JOIN clients ON invoices.client_id = clients.id
    `;
    const params = [];

    if (clientId) {
      query += ' WHERE invoices.client_id = ?';
      params.push(clientId);
    }

    query += ' ORDER BY invoices.created_at DESC';

    const [invoices] = await pool.query(query, params);

    const invoicesParsed = invoices.map(inv => ({
      ...inv,
      total: Number(inv.total) || 0
    }));

    res.json(invoicesParsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener facturas' });
  }
};



// Obtener factura por id
exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const [invoices] = await pool.query('SELECT * FROM invoices WHERE id = ?', [id]);
    if (invoices.length === 0)
      return res.status(404).json({ message: 'Factura no encontrada' });

    res.json(invoices[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener factura' });
  }
};

// Crear factura con ítems
exports.createInvoiceWithItems = async (req, res) => {
  const { client_id, date, items } = req.body;

  if (!client_id || !date || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: 'Faltan campos o no hay ítems' });

  try {
    // Insertar factura 
    const [resultInvoice] = await pool.query(
      'INSERT INTO invoices (client_id, date, total, created_at) VALUES (?, ?, 0, NOW())',
      [client_id, date]
    );

    const invoiceId = resultInvoice.insertId;

    // Insertar ítems asociados y calcular total
    let total = 0;
    for (const item of items) {
      const { description, quantity, price } = item;
      if (!description || !quantity || !price) {
        return res.status(400).json({ message: 'Ítems inválidos' });
      }
      total += quantity * price;

      await pool.query(
        'INSERT INTO invoice_items (invoice_id, description, quantity, price) VALUES (?, ?, ?, ?)',
        [invoiceId, description, quantity, price]
      );
    }

    // Actualizar total de la factura
    await pool.query('UPDATE invoices SET total = ? WHERE id = ?', [total, invoiceId]);

    res.status(201).json({ id: invoiceId, client_id, date, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear factura' });
  }
};

// Actualizar factura 
exports.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { client_id, date } = req.body;

  if (!client_id || !date)
    return res.status(400).json({ message: 'Faltan campos' });

  try {
    const [result] = await pool.query(
      'UPDATE invoices SET client_id = ?, date = ? WHERE id = ?',
      [client_id, date, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Factura no encontrada' });

    res.json({ message: 'Factura actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar factura' });
  }
};

// Eliminar factura y sus ítems
exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  try {
    // Borrar ítems asociados
    await pool.query('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);

    // Borrar factura
    const [result] = await pool.query('DELETE FROM invoices WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Factura no encontrada' });

    res.json({ message: 'Factura eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar factura' });
  }
};
