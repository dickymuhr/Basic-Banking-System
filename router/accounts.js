const express = require('express');
const router = express.Router();
const controller = require('../app/controller')


router.get('/v1/accounts', controller.accounts.get)
router.get('/v1/accounts/:id', controller.accounts.getById)
router.post('/v1/accounts', controller.accounts.create)


module.exports = router;