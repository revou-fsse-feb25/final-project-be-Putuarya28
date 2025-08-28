import express, { Request, Response } from "express";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface User {
      id: number;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}
import multer from "multer";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET images by label
app.get("/api/design-images", async (req: Request, res: Response) => {
  const { label } = req.query;
  const images = await prisma.designImage.findMany({
    where: { label: label as string },
    orderBy: { createdAt: "desc" },
  });
  res.json(images);
});

// POST upload image
app.post(
  "/api/design-images",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { label, title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    await prisma.designImage.create({
      data: { label, title, description, imageUrl },
    });
    const images = await prisma.designImage.findMany({
      where: { label },
      orderBy: { createdAt: "desc" },
    });
    res.json(images);
  }
);

// DELETE image by id
app.delete("/api/design-images/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await prisma.designImage.delete({ where: { id } });
  res.json({ success: true });
});

// GET bookings by customerId
app.get(
  "/bookings/customer/:customerId",
  async (req: Request, res: Response) => {
    const customerId = parseInt(req.params.customerId);
    try {
      const bookings = await prisma.booking.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
      });
      res.json(bookings);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: "Failed to fetch bookings", details: err.message });
    }
  }
);

// GET user by id
app.get("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: err.message });
  }
});

// PATCH update user profile
app.patch("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    res.json(user);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
});

// POST create new booking
app.post(
  "/bookings",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    // Always set customerId for user bookings if authenticated
    const { name, email, whatsapp, date, time } = req.body;
    if (!name || !email || !whatsapp || !date || !time) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "whatsapp", "date", "time"],
        received: req.body,
      });
    }
    // Use authenticated user id if available, else fallback to request body or null
    let customerId: number | null = null;
    if (req.user && typeof req.user.id === "number") {
      customerId = req.user.id;
    } else if (req.body.customerId && typeof req.body.customerId === "number") {
      customerId = req.body.customerId;
    }
    const bookingData = { ...req.body, customerId };
    try {
      const booking = await prisma.booking.create({
        data: bookingData,
      });
      res.status(201).json(booking);
    } catch (err: unknown) {
      let message = "Internal server error";
      if (err instanceof Error) message = err.message;
      res
        .status(500)
        .json({ error: "Failed to create booking", details: message });
    }
  }
);

// GET all bookings
app.get("/bookings", async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch bookings", details: err.message });
  }
});

// PATCH update booking orderDetails
app.patch("/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { orderDetails, status, date, time, trackingCode } = req.body;
  try {
    const updateData: any = {};
    if (orderDetails !== undefined) updateData.orderDetails = orderDetails;
    if (status !== undefined) updateData.status = status;
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (trackingCode !== undefined) updateData.trackingCode = trackingCode;
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });
    res.json(booking);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to update booking", details: err.message });
  }
});
