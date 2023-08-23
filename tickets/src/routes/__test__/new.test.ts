import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

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
    .send();
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
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "book", price: 10 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("book");
  expect(tickets[0].price).toEqual("10");
});
