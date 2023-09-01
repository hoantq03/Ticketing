import { OrderCreatedEvent, OrderStatus } from "@eztik/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  //create instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a ticket
  const ticket = Ticket.build({
    price: 20,
    title: "Concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
    },
    userId: ticket.userId,
    version: ticket.version,
    expiresAt: "asdasd",
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, ticket, msg, listener };
};

it("sets the orderId of the ticket ", async () => {
  const { data, ticket, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event ", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
