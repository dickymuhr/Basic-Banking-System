const request = require('supertest');
const app = require('../index'); 
const prisma = require('../app/prismaClient');

describe("Transactions API", () => {
    describe("GET /v1/transactions", () => {
        test("should return a list of transactions", async () => {
            const response = await request(app).get('/v1/transactions');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting all transactions data successfully!');
            expect(response.body.data).toBeInstanceOf(Array);
        });

        test("should return an empty list when no transactions found", async () => {
            const mock = jest.spyOn(prisma.transactions, 'findMany').mockResolvedValueOnce([]);

            const response = await request(app).get('/v1/transactions');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Data is empty');
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data).toHaveLength(0);

            mock.mockRestore();
        });
    });

    describe("GET /v1/transactions/:id", () => {
        test("should return a specific transaction by id", async () => {
            const transactionId = 1;
            const dummyTransaction = {
                id: transactionId,
                source_account_id: 2,
                destination_account_id: 3,
                amount: 100.00,
            };

            const mock = jest.spyOn(prisma.transactions, 'findUnique').mockResolvedValueOnce(dummyTransaction);

            const response = await request(app).get(`/v1/transactions/${transactionId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting transaction data successfully!');
            expect(response.body.data).toEqual(dummyTransaction);

            mock.mockRestore();
        });

        test("should return 400 when transactionId is not a number", async () => {
            const response = await request(app).get(`/v1/transactions/abc`);
            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Bad Request! Id is not valid");
        });

        test("should return 404 when transactionId not found", async () => {
            const transactionId = 9000;
            const mock = jest.spyOn(prisma.transactions, 'findUnique').mockResolvedValueOnce(null);

            const response = await request(app).get(`/v1/transactions/${transactionId}`);
            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe("Transaction not found");

            mock.mockRestore();
        });
    });

    describe('POST /v1/transactions', () => {
        test('should create a new transaction with valid data', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 100,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 })  
                .mockResolvedValueOnce({ id: 2, balance: 200 });  
        
            jest.spyOn(prisma.transactions, 'create').mockResolvedValueOnce({
                ...transactionData,
                id: 3, 
            });
        
            jest.spyOn(prisma, '$transaction').mockImplementation(async (actions) => {
                return actions.map(action => {
                    if (typeof action === 'function') {
                        return Promise.resolve({ id: action.where.id, balance: action.data.balance });
                    }

                    return Promise.resolve({ ...transactionData, id: 3 }); 
                });
            });
            
        
            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(201);
            expect(response.body.message).toBe('Transaction completed successfully!');
        });
        
        

        test('should not allow transaction between the same account', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 1,
                amount: 100,
            };

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('error');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe('A transaction cannot occur between the same account.');
        });

        test('should not allow transaction with amount less than or equal to zero', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 0,
            };

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe('Transaction amount should be greater than zero.');
        });

        test('should return 404 if source or destination account does not exist', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 3,
                amount: 100,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 }) 
                .mockResolvedValueOnce(null); 

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe('Source or destination account not found.');
        });

        test('should not allow transaction if source account has insufficient funds', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 600,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 }) 
                .mockResolvedValueOnce({ id: 2, balance: 200 }); 

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe('Insufficient funds in source account.');
        });


    });
});
