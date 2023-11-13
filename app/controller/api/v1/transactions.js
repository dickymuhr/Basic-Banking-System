const prisma = require('../../../prismaClient');

module.exports = {
    async create(req, res) {
        const { source_account_id, destination_account_id, amount } = req.body;

        // Check if the source account is the same as the destination account
        if (source_account_id === destination_account_id) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'A transaction cannot occur between the same account.',
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: 'Transaction amount should be greater than zero.',
            });
        }

        const sourceAccount = await prisma.bankAccounts.findUnique({ where: { id: source_account_id } });
        const destinationAccount = await prisma.bankAccounts.findUnique({ where: { id: destination_account_id } });

        if (!sourceAccount || !destinationAccount) {
            return res.status(404).json({
                status: 'fail',
                code: 404,
                message: 'Source or destination account not found.',
            });
        }

        if (sourceAccount.balance < amount) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: 'Insufficient funds in source account.',
            });
        }

        try {
            await prisma.$transaction([
                prisma.bankAccounts.update({
                    where: { id: source_account_id },
                    data: { balance: sourceAccount.balance - amount },
                }),
                prisma.bankAccounts.update({
                    where: { id: destination_account_id },
                    data: { balance: destinationAccount.balance + amount },
                }),
                prisma.transactions.create({
                    data: {
                        source_account_id,
                        destination_account_id,
                        amount,
                    },
                }),
            ]);

            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Transaction completed successfully!',
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
            const transactions = await prisma.transactions.findMany();

            if (!transactions.length) {
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Data is empty',
                    data: transactions
                });
            }
    
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Getting all transactions data successfully!',
                data: transactions
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },
    async getById(req, res){
        try{
            const transactionId = parseInt(req.params.id,10);

            if(!transactionId){
                return res.status(400).json({
                    status:'fail',
                    code: 400,
                    message: 'Bad Request! Id is not valid'
                });
            }

            const transaction = await prisma.transactions.findUnique({
                where:{
                    id: transactionId
                },
                include:{
                    sourceAccount: {
                        select: {
                            bank_name: true,
                            account_number: true
                        }
                    },
                    destinationAccount: {
                        select: {
                            bank_name: true,
                            account_number: true
                        }
                    },
                },
            });

            if(!transaction){
                return res.status(404).json({
                    status:'fail',
                    code: 404,
                    message: 'Transaction not found',
                });
            }

            res.status(200).json({
                status:'success',
                code: 200,
                message: 'Getting transaction data successfully!',
                data: transaction,
            });

        } catch (err){
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },
};
