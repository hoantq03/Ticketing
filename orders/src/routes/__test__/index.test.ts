import request from "supertest";
import { Ticket, TicketDoc } from "../../models/ticket";
import { app } from "../../app";

const buildTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for an particular user", async () => {
  const ticOne = await buildTicket();
  const tictwo = await buildTicket();
  const ticThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticOne.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticThree.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: tictwo.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userOne)
    .send()
    .expect(200);

  console.log(orderOne);
  console.log(response.body);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
