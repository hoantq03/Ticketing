import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";
import { BadRequestError } from "../errors/user-existed";
import { User } from "../models/user";
import * as bcrypt from "bcrypt";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const { email, password } = req.body;
      const userExisted = await User.findOne({ email });

      if (userExisted) {
        throw new BadRequestError("Email in use");
      }
      const passwordHashed = await Password.toHash(password);

      const user = await User.build({ email, password: passwordHashed });
      await user.save();

      res.status(201).send(user);
    } catch (err) {
      console.log("ERROR :", err);
    }
  }
);

export { router as signupRouter };
