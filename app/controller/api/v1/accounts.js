const prisma = require('../../../prismaClient');

module.exports = {
    async create(req, res) {
        const userId = parseInt(req.body.userId, 10);
        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: 'Bad Request! User ID is not valid',
            });
        }

        try {
            // Check if the user exists
            const userExists = await prisma.users.findUnique({
                where: {
                    id: userId
                }
            });

            // If the user doesn't exist, return an error
            if (!userExists) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'User not found!',
                });
            }
            
            const newBankAccount = await prisma.bankAccounts.create({
                data: {
                    ...req.body,
                    userId: userId
                }
            });
    
            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Bank Account created successfully!',
                data: newBankAccount
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async get(req, res) {
        try {
            const bankAccounts = await prisma.bankAccounts.findMany();
    
            if (!bankAccounts.length) {
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Data is empty',
                    data: bankAccounts
                });
            }

            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Getting all accounts data successfully!',
                data: bankAccounts
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async getById(req, res) {
        try {
            const bankAccountId = parseInt(req.params.id, 10);
    
            if (!bankAccountId) {
                return res.status(400).json({
                    status: 'fail',
                    code: 400,
                    message: 'Bad Request! Account ID is not valid',
                });
            }
    
            const bankAccount = await prisma.bankAccounts.findUnique({
                where: {
                    id: bankAccountId
                },
                include: {
                    user: true, 
                    sentTransactions: true,
                    receivedTransactions: true,
                },
            });
    
            if (!bankAccount) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'Bank Account not found!',
                });
            }
    
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Getting account data successfully!',
                data: bankAccount
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