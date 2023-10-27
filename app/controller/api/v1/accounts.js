const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    async create(req, res) {
        try {
            const newBankAccount = await prisma.bankAccounts.create({
                data: {
                    ...req.body,
                    userId: parseInt(req.body.userId, 10) // Assuming that userId is passed within the request body
                }
            });
    
            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Bank Account created successfully!',
                data: newBankAccount
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: error.message,
            });
        }
    },

    async get(req, res) {
        try {
            const bankAccounts = await prisma.bankAccounts.findMany();
    
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Bank Accounts fetched successfully!',
                data: bankAccounts
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: error.message,
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
                    message: 'Bad Request! A valid id is required',
                });
            }
    
            const bankAccount = await prisma.bankAccounts.findUnique({
                where: {
                    id: bankAccountId
                },
                include: {
                    user: true, // Including related Profile data
                },
            });
    
            if (!bankAccount) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'Bank Account not found!',
                });
            }
    
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Bank Account fetched successfully!',
                data: bankAccount
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