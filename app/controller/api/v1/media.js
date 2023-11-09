const prisma = require('../../../prismaClient');

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
    }
}