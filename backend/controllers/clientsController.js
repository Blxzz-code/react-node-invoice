const pool = require('../config/db');

// Obtener todos los clientes
exports.getClients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
};

// Obtener un cliente por ID
exports.getClientById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
};

// Crear nuevo cliente
exports.createClient = async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ message: 'El nombre es obligatorio' });

  try {
    const [result] = await pool.query(
      'INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el cliente' });
  }
};

// Actualizar cliente
exports.updateClient = async (req, res) => {
  const { name, email, phone } = req.body;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
};

// Eliminar cliente
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
};

