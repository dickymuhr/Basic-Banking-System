const request = require('supertest');
const app = require('../index'); 
const prisma = require('../app/prismaClient');

describe("Users API", () => {
    describe("GET /v1/users", () => {
        test("should return a list of users", async () => {
            const response = await request(app).get('/v1/users');
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting all users data successfully!');
            expect(response.body.data).toBeInstanceOf(Array);
        });

        test("should return an empty list when no users found", async () => {
            const mock = jest.spyOn(prisma.users, 'findMany').mockResolvedValueOnce([]);

            const response = await request(app).get('/v1/users');
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

    describe("GET /v1/users/:id", () => {
        test("should return specific user by id", async () => {
            const userId = 1;
            const dummyUser = {
                id: userId,
                name: "John Doe",
                email: "john.doe@example.com",
                profile: {
                    identity_type: "passport",
                    identity_number: "A1234567",
                    address: "123 Main St",
                },
            };

            const mock = jest.spyOn(prisma.users, 'findUnique').mockResolvedValueOnce(dummyUser);

            const response = await request(app).get(`/v1/users/${userId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(200);
            expect(response.body.message).toBe('Getting user data successfully!');
            expect(response.body.data).toEqual(dummyUser);

            mock.mockRestore();
        });

        test("should throw error, invalid userId", async () => {
            const response = await request(app).get(`/v1/users/d`);
            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Bad Request! Id is not valid");
        });

        test("should throw error, userId not found", async () => {
            const userId = 9000;
            const mock = jest.spyOn(prisma.users, 'findUnique').mockResolvedValueOnce(null);

            const response = await request(app).get(`/v1/users/${userId}`);
            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe('fail');
            expect(response.body.code).toBe(404);
            expect(response.body.message).toBe("User not found");

            mock.mockRestore();
        });
    });

    describe("POST /v1/users", () => {
        test("should create a new user", async () => {
            const newUser = {
                name: "Tony Stark",
                email: "tony@starkindustries.com",
                password: "ironman",
                identity_type: "driver_license",
                identity_number: "1234567890",
                address: "10880 Malibu Point, Malibu, California",
            };

            const mock = jest.spyOn(prisma.users, 'create').mockResolvedValueOnce({
                ...newUser,
                id: 1,
                profile: {
                    identity_type: newUser.identity_type,
                    identity_number: newUser.identity_number,
                    address: newUser.address,
                },
            });

            const response = await request(app)
                .post('/v1/users')
                .send(newUser);

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.code).toBe(201);
            expect(response.body.message).toBe("User data added!");
            expect(response.body.data).toEqual(expect.objectContaining({
                name: newUser.name,
                email: newUser.email,
                profile: expect.any(Object)
            }));

            mock.mockRestore();
        });

    });
});
