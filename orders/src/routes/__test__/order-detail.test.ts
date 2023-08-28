import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { OrderStatus } from "@eztik/common";
import { Ticket } from "../../models/ticket";
import { sign } from "jsonwebtoken";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "concert",
  });
  await ticket.save();
  const user = signin();
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  console.log("order id " + order.body);

  await request(app)
    .get("/api/orders/" + order.body.id)
    .set("Cookie", user)
    .send()
    .expect(200);
});
