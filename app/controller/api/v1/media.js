const prisma = require('../../../prismaClient');
const qr = require('node-qr-image');

module.exports = {
    uploadImage: async (req, res) => {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        return res.status(200).json({
            status: true,
            message: 'success',
            data: {
                image_url: imageUrl
            }
        })
    },
    qrcode: async (req,res) => {
        const { url } = req.body;

        const qrCode = qr.image(url, { type: 'png'} )
        res.setHeader("Content-Type", "image/png")
        qrCode.pipe(res)
    }
}