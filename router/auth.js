const express = require('express');
const router = express.Router();
const controller = require('../app/controller');
const { auth } = require('../utils/jwt');

router.post('/v1/auth/login', controller.auth.login)
router.post('/v1/auth/register', controller.auth.register)
router.get('/v1/auth/authenticate', auth, controller.auth.authenticate)

module.exports = router;