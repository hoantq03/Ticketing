import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { validateRequest } from "../middlewares";
import { User } from "../models";
import { Password } from "../services";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ max: 20, min: 4 })
      .withMessage("Password must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // if email not exist
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credential");
    }
    //check password
    const isMatch: boolean = await Password.toCompare(user.password, password);
    // generate new jwt and store in session again
    if (!isMatch) {
      throw new BadRequestError("Invalid Credential");
    }
    const token: string = jwt.sign(
      { email: user.email, id: user.id },
      `${process.env.JWT_KEY}`
    );

    // store token to session
    req.session = { jwt: token };

    res.status(201).json({ message: "signin succeed", token });
  }
);

export { router as signinRouter };
