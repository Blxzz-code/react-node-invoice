const express = require('express');
const router = express.Router();
const {
  getItemsByInvoice,
  addItem,
  deleteItem
} = require('../controllers/itemsController');

router.get('/:invoice_id', getItemsByInvoice); 
router.post('/', addItem);                    
router.delete('/:id', deleteItem);            

module.exports = router;
