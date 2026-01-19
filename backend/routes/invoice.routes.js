const router = require('express').Router();
const {
  createInvoice,
  getInvoices
} = require('../controllers/invoice.controller');

router.post('/', createInvoice);
router.get('/', getInvoices);

module.exports = router;
