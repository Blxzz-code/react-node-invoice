const express = require('express');
const router = express.Router();

const {
  getInvoices,
  getInvoiceById,
  createInvoiceWithItems,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoicesController');

// Rutas
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoiceWithItems); 
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;
