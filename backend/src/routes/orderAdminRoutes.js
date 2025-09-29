const express = require('express');
const router = express.Router();
const orderAdminController = require('../controllers/orderAdminController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');
router.get('/', [verifyToken, isOwner], orderAdminController.getAllOrders);
router.put('/:id/complete', [verifyToken, isOwner], orderAdminController.markOrderAsComplete);
router.put('/:id/cancel', [verifyToken, isOwner], orderAdminController.cancelOrder);
module.exports = router;