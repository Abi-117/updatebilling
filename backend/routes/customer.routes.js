const router = require('express').Router();
const {
  createCustomer,
  getCustomers
} = require('../controllers/customer.controller');

router.post('/', createCustomer);
router.get('/', getCustomers);

module.exports = router;
