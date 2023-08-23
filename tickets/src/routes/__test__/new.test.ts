import request from "supertest";
import { app } from "../../app";

it("has a route handler listener to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only access if the user sign in", async () => {
  return request(app).post("/api/tickets").send({}).expect(401);
});

it("return the status other than 401 if the user sign in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});
  return expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);
});

it("return an error if an price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "book", price: -10 })
    .expect(400);
});

it("creates tickets with an valid inputs", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "book", price: 10 })
    .expect(400);
});
