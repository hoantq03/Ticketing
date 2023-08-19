import express from "express";
import { BadRequestError } from "../errors";

const router = express.Router();

router.get("/api/users/signout", (req, res) => {
  if (!req.session?.jwt) {
    throw new BadRequestError("You're not logged in");
  }
  req.session = null;
  res.status(201).json({ message: "logged out succeed" });
});

export { router as signoutRouter };
