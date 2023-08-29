import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "Silence",
    userId: "asdasdasd",
  });

  await ticket.save();

  // fetched two separated ticket
  const fetchedOne = await Ticket.findById(ticket.id);
  const fetchedTwo = await Ticket.findById(ticket.id);

  // make changed two tickets
  fetchedOne!.price = 5;
  fetchedTwo!.price = 15;

  // save the first fetched ticket to db
  await fetchedOne!.save();

  //save the second fetched ticket and expected an error
  try {
    await fetchedTwo!.save();
  } catch (err) {
    return;
  }
});
