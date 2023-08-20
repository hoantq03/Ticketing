import request from "supertest";
import { app } from "../../app";

it("returns 200 when sign out successful", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const responseSignin = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);
  expect(responseSignin.get("Set-Cookie")).toBeDefined();

  const responseSignout = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  return expect(responseSignout.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
