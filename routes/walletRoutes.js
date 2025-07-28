const express = require('express');
const router = express.Router();
const { fundWallet, getWallet, transferFunds, withdrawFunds, deleteWallet } = require('../controllers/wallet');

router.get('/:id', getWallet);
router.post('/:id/fund', fundWallet);
router.post('/:id/transfer', transferFunds);
router.post('/:id/withdraw', withdrawFunds);
router.delete('/:id', deleteWallet);

module.exports = router;