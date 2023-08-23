import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { response } from "express";
import mongoose from "mongoose";

it("return a 404 if the ticket not found", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${ticketId}`).send().expect(404);
});

it("return a ticket if the ticket found", async () => {
  const title = "book";
  const price = 123;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title.toString());
  expect(ticketResponse.body.price).toEqual(price.toString());
});
