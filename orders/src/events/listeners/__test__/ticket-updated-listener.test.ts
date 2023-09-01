import { TicketUpdatedEvent } from "@eztik/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "concert",
    version: 0,
  });
  await ticket.save();
  //create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 10,
    title: "concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version++;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    console.log(error);
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
