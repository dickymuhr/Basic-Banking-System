const express = require('express');
const router = express.Router();
const controller = require('../app/controller')


router.get('/v1/users', controller.users.get)
router.get('/v1/users/:id', controller.users.getById)
router.post('/v1/users', controller.users.create)


module.exports = router;