const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

// Order routes
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder)
  .delete(deleteOrder);

router.route('/:id/status')
  .patch(updateOrderStatus);

module.exports = router;