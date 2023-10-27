const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    async get(req, res) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            
            const users = await prisma.users.findMany({
                where: {
                    name: {
                        contains: search || '',
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
                    message: 'Data Empty',
                });
            }

            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Success!',
                data: users,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                code: 500,
                message: error.message,
            });
        }
    },

    async getById(req, res) {
        // Validate the input
        const userId = parseInt(req.params.id, 10);
        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: 'Bad Request! A valid id is required',
            });
        }

        try {
            // Fetch the user by id using Prisma
            const user = await prisma.users.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    profile: true, // Including related Profile data
                },
            });

            // Handle case when user does not exist
            if (!user) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'User not found',
                });
            }

            // Send the response with user data
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Success!',
                data: user,
            });

        } catch (error) {
            // Handle unexpected errors
            return res.status(500).json({
                status: 'error',
                code: 500,
                message: error.message,
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
                message: 'Data ditambahkan!',
                data: user
            });
    
        } catch (error) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: error.message,
            });
        }
    },    
}