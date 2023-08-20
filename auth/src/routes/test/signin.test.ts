import request from "supertest";
import { app } from "../../app";

it("returns 200 when signin successful", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);
});

it("returns 400 when email invalid", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test", password: "password" })
    .expect(400);
});

it("returns 400 when password invalid", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test", password: "1" })
    .expect(400);
});

it("returns 400 when email and password invalid", async () => {
  return request(app).post("/api/users/signin").send({}).expect(400);
});

it("return 201 when sign and set the jwt to cookie", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);
  return expect(response.get("Set-Cookie")).toBeDefined();
});
