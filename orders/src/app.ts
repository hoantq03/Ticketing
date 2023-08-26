import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { currentUser, errorHandler, NotFoundError } from "@eztik/common";
import { cancelOrderRouter } from "./routes/cancel-order";
import { createOrderRouter } from "./routes/create-orders";
import { indexOrderRouter } from "./routes/index";
import { orderDetailRouter } from "./routes/orders-detail";

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

app.use(cancelOrderRouter);
app.use(createOrderRouter);
app.use(indexOrderRouter);
app.use(orderDetailRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
