import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../models/orders";
import { OrderStatus } from "@eztik/common";

it("return 401 if an ticket not your own", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await ticket.save();
  const userOne = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(401);
});

it("cancel ticket succeed", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await ticket.save();
  const userOne = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("cancel ticket succeed", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await ticket.save();
  const userOne = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete("/api/orders/" + new mongoose.Types.ObjectId())
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(404);
});
