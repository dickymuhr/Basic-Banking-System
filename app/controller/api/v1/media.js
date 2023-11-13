const prisma = require('../../../prismaClient');
const qr = require('node-qr-image');
const imagekit = require('../../../../utils/imagekit')

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
    },
    imagekitUpload: async(req,res) => {
        try{
            const stringFile = req.file.buffer.toString('base64');
            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })
    
            return res.status(200).json({
                status: 'OK',
                message: ' Success',
                data: {
                    name: uploadFile.name,
                    url: uploadFile.url,
                    type: uploadFile.fileType
                }
            })
        } catch(err){
            throw err;
        }
    }
}