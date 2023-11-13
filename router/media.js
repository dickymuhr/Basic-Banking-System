const express = require('express');
const router = express.Router();
const controller = require('../app/controller')
const storage = require('../utils/multer')
const multer = require('multer')

router.use('/images', express.static('public/images'))

router.post('/v1/upload', 
            storage.image.single('image'), 
            controller.media.uploadImage);

router.post('/v1/qrcode', controller.media.qrcode)

router.post('/v1/upload/imagekit', multer().single('image') ,controller.media.imagekitUpload)

module.exports = router;