import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "mail.aryawibawa@gmail.com";
  const plainPassword = "@Rya280165";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️ Admin user already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
      isConfirmed: true,
    },
  });

  console.log("✅ Admin account created");
  await prisma.$disconnect();
}

createAdmin();
