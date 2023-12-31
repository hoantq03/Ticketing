import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@eztik/common";
import { createTicketRouter } from "./routes/create-tickets";
import { showTicketRouter } from "./routes/get-tickets";
import { IndexTicketRouter } from "./routes";
import { UpdateTicketRouter } from "./routes/update-tickets";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createTicketRouter);

app.use(showTicketRouter);

app.use(IndexTicketRouter);

app.use(UpdateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
