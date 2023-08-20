import request from "supertest";
import { app } from "../../app";

it("response with details about the current user", async () => {
  const cookie: string[] = await signin();
  const responseCurrentUser = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  return expect(responseCurrentUser.body.currentUser.email).toEqual(
    "test@test.com"
  );
});

it("responses with null if not authenticated", async () => {
  const responseCurrentUser = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  return expect(responseCurrentUser.body.currentUser).toBeNull();
});
