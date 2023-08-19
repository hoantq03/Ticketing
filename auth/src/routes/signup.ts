import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../models";
import { Password } from "../services";
import jwt from "jsonwebtoken";

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
  async (req: Request, res: Response, next: NextFunction) => {
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

      const token = jwt.sign({ email }, `${process.env.PRIVATE_KEY_JWT}`, {
        expiresIn: "15m",
      });

      req.session = {
        jwt: token,
      };

      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRouter };
