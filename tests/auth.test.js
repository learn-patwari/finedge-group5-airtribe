import request from "supertest";
import app from "../src/app.js";

describe("Auth APIs", () => {
  it("should register a user", async () => {
    const register = await request(app)
      .post("/users/register")
      .send({
        email: "test3@mail.com",
        password: "123456"
    });

    expect(register.body.email).toBe("test3@mail.com");
    expect(register.statusCode).toBe(201);
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({
        email: "test3@mail.com",
        password: "123456"
      });

    expect(res.body.token).toBeDefined();
  });
});