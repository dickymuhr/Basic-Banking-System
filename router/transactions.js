const express = require('express');
const router = express.Router();
const controller = require('../app/controller')


router.get('/v1/transactions', controller.transactions.get)
router.get('/v1/transactions/:id', controller.transactions.getById)
router.post('/v1/transactions', controller.transactions.create)


module.exports = router;