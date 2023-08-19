import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { validateRequest } from "../middlewares";
import { User } from "../models";
import { Password } from "../services";

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
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const userExisted = await User.findOne({ email });

    if (userExisted) {
      throw new BadRequestError("Email in use");
    }
    const passwordHashed = await Password.toHash(password);

    const user = await User.build({ email, password: passwordHashed });
    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user.id },
      `${process.env.JWT_KEY}`,
      {
        expiresIn: "15m",
      }
    );

    req.session = {
      jwt: token,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
