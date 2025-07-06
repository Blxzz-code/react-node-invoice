const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ status: 'OK', db_test: rows[0].result });
  } catch (error) {
    res.status(500).json({ error: 'DB connection failed' });
  }
});


app.use('/api/clients', require('./routes/clientsRoutes'));
app.use('/api/invoices', require('./routes/invoicesRoutes'));
app.use('/api/items', require('./routes/itemsRoutes'));

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});

