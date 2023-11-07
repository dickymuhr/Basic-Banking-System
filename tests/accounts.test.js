const request = require('supertest');
const app = require('../index'); 
const prisma = require('../app/prismaClient');

describe("Accounts API", () => {
    describe("GET /v1/accounts", () => {
        test("should return a list of accounts", async () => {
            const response = await request(app).get('/v1/accounts');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting all accounts data successfully!');
            expect(response.body.data).toBeInstanceOf(Array);
        });

        test("should return an empty list", async () => {
            const mock = jest.spyOn(prisma.bankAccounts, 'findMany').mockResolvedValueOnce([]);

            const response = await request(app).get('/v1/accounts');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Data is empty');
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data).toEqual([]);
            expect(response.body.data).toHaveLength(0);

            mock.mockRestore();
        });
    });

    describe("GET /v1/accounts/:id", () => {
        test("should return specific account by id", async () =>{
            const accountId = "1"
            const mockAccount = {
                id: parseInt(accountId, 10),
            };
            const mock = jest.spyOn(prisma.bankAccounts, 'findUnique').mockResolvedValueOnce(mockAccount);
            const response = await request(app).get(`/v1/accounts/${accountId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting account data successfully!');
            expect(response.body.data).toEqual(expect.any(Object));
            expect(response.body.data.id).toBe(parseInt(accountId, 10));

            mock.mockRestore();
        });

        test("should throw error, missing or invalid accountId", async () =>{
            const accountId = "d"
            const response = await request(app).get(`/v1/accounts/${accountId}`);
            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Bad Request! Account ID is not valid");
        });

        test("should throw error, accountId not found", async () => {
            const accountId = "9000";
            const findUniqueSpy = jest.spyOn(prisma.bankAccounts, 'findUnique').mockResolvedValueOnce(null);
    
            const response = await request(app).get(`/v1/accounts/${accountId}`);
    
            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe("Bank Account not found!");
    
            expect(findUniqueSpy).toHaveBeenCalledWith({
                where: {
                    id: parseInt(accountId, 10),
                },
                include: {
                    user: true, 
                    sentTransactions: true,
                    receivedTransactions: true,
                },
            });
    
            findUniqueSpy.mockRestore();
        });
        
    });

    describe("POST /v1/accounts", () =>{
        test("should create a new account", async () => {
            const newAccount = {
              "userId": "2",
              "bank_name": "Stark Industries Bank",
              "account_number": "1112233330",
              "balance": 20000.50
            };
        
            const findUniqueSpy = jest.spyOn(prisma.users, 'findUnique').mockResolvedValue({
              id: parseInt(newAccount.userId, 10),
              name: 'Tony Stark'
            });
        
            const createSpy = jest.spyOn(prisma.bankAccounts, 'create').mockResolvedValue({
              ...newAccount,
              id: 1, 
              userId: parseInt(newAccount.userId, 10),
            });
        
            const response = await request(app)
              .post('/v1/accounts')
              .send(newAccount);
        
            expect(findUniqueSpy).toHaveBeenCalledWith({
              where: {
                id: parseInt(newAccount.userId, 10),
              },
            });
            
            expect(createSpy).toHaveBeenCalledWith({
              data: {
                ...newAccount,
                userId: parseInt(newAccount.userId, 10),
              },
            });
        
            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(201);
            expect(response.body.message).toBe("Bank Account created successfully!");
            expect(response.body.data).toHaveProperty('userId', parseInt(newAccount.userId, 10));
        
            findUniqueSpy.mockRestore();
            createSpy.mockRestore();
          });

        test("should throw error, missing or invalid userId", async () => {
            const newAccount = {
                "userId": "",
                "bank_name": "Stark Industries Bank",
                "account_number": "1112233330",
                "balance": 20000.50
            };
            const response = await request(app)
                .post('/v1/accounts')
                .send(newAccount);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Bad Request! User ID is not valid");
        });

        test("should throw error, userId not found", async () => {
            const newAccount = {
                "userId": "9000", 
                "bank_name": "Stark Industries Bank",
                "account_number": "1112233330",
                "balance": 20000.50
            };

            const mock = jest.spyOn(prisma.users, 'findUnique').mockResolvedValueOnce(null);
        
            const response = await request(app)
                .post('/v1/accounts')
                .send(newAccount);
        
            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe("User not found!");
        
            mock.mockRestore();
        });
        
    });
});
