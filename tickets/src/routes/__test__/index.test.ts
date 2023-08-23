import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "book", price: 20 });
};

it("can fetch a list of tickets", async () => {
  for (let i = 0; i < 10; i++) {
    await createTicket();
  }

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", signin())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(10);
});
