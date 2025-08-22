const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET images by label
app.get("/api/design-images", async (req, res) => {
  const { label } = req.query;
  const images = await prisma.designImage.findMany({
    where: { label },
    orderBy: { createdAt: "desc" },
  });
  res.json(images);
});

// POST upload image
app.post("/api/design-images", upload.single("file"), async (req, res) => {
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
});

// DELETE image by id
app.delete("/api/design-images/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.designImage.delete({ where: { id } });
  res.json({ success: true });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
