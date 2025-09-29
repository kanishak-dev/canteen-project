const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');
router.post('/', [verifyToken, isOwner], menuController.createMenuItem);
router.put('/:id', [verifyToken, isOwner], menuController.updateMenuItem);
router.delete('/:id', [verifyToken, isOwner], menuController.deleteMenuItem);
module.exports = router;