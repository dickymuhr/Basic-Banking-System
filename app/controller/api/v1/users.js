const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    async get(req, res) {
        try {
            const { search = "", page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const searchTerm = search.trim().toLowerCase();
            
            const users = await prisma.users.findMany({
                where: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                skip: skip,
                take: parseInt(limit),
                // include: {
                //     profile: true, // Including related Profile data
                // },
            });
            
            if (!users.length) {
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Data is empty',
                });
            }

            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Getting all users data successfully!',
                data: users,
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async getById(req, res) {
        const userId = parseInt(req.params.id, 10);
        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: 'Bad Request! Id is not valid',
            });
        }

        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    profile: true, 
                },
            });

            if (!user) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Getting user data successfully!',
                data: user,
            });

        } catch (err) {
            // Handle unexpected errors
            return res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async create(req, res) {
        try {
            const { name, email, password, identity_type, identity_number, address } = req.body;
    
            const user = await prisma.users.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                    profile: {
                        create: {
                            identity_type: identity_type,
                            identity_number: identity_number,
                            address: address,
                        }
                    }
                }
            });
    
            console.log(user)
    
            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'User data added!',
                data: user
            });
    
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },    
}