import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return 404 if ticket not found", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", signin())
    .send({ title: "book", price: 30 })
    .expect(404);
});

it("return 401 if the user is not authenticated", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: "book", price: 30 })
    .expect(401);
});

it("return 401 if the user does not own tickets", async () => {
  const responseTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "book", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${responseTicket.body.id}`)
    .set("Cookie", signin())
    .send({ title: "updated book", price: 99 })
    .expect(401);
});

it("return 400 if the user provided invalid title or price", async () => {
  const cookie = signin();

  const responseCreateTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "book", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${responseCreateTicket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "book", price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${responseCreateTicket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${responseCreateTicket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: -10 })
    .expect(400);
});

it("return 200 if provided valid title and price", async () => {
  const cookie = signin();

  const responseCreateTicket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "book", price: 10 })
    .expect(201);

  const responseUpdateTicket = await request(app)
    .put(`/api/tickets/${responseCreateTicket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "book", price: 10 })
    .expect(200);

  expect(responseUpdateTicket.body.title).toEqual("book");
  expect(responseUpdateTicket.body.price).toEqual("10");
});
