const express = require('express');
const router = express.Router();
const controller = require('../app/controller')
const storage = require('../utils/multer')

router.use('/images', express.static('public/images'))

router.post('/v1/upload', 
            storage.image.single('image'), 
            controller.media.uploadImage)


module.exports = router;