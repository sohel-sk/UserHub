import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma/prismaClient";

afterAll(async () => { 
    await prisma.user.delete({
        where: {
            email: "test@example.com"
        }
    });
})


describe("Authentication Endpoints", () => { 
    const agent = request.agent(app);
    it("should register a new user", async () => {
        const res = await agent.post("/auth/signup").send({
            name: "Test User",
            email: "test@example.com",
            password: "Password123"
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.headers['set-cookie']).toBeDefined();
    });


    it("should not allow duplicate signup", async () => { 
        const res = await agent.post("/auth/signup").send({
            name: "Test User",
            email: "test@example.com",
            password: "Password123"
        });

        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty("message", "Email already registered");
    });


    it("should login and set auth cookie", async () => {
        const res = await agent.post("/auth/login").send({
            email: "test@example.com",
            password: "Password123"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Login Successfull");
        expect(res.headers['set-cookie']).toBeDefined();
    });
    
    it("should block access to protected route without cookie", async () => {
        const res = await request(app).get("/auth/me");
        expect(res.status).toBe(401);
    });

    it("should allow access to protected route with cookie", async () => {
        

        const res = (await agent.get("/auth/me"));


        console.log(res.headers["set-cookie"]);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("test@example.com");
    });
});