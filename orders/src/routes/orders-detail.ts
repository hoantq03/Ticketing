import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders/:id", async (req: Request, res: Response) => {});

router.get("/api/orders", async () => {});

export { router as orderDetailRouter };
