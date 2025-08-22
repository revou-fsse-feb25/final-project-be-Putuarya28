import nodemailer from "nodemailer";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as crypto from "crypto";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Check if email already exists in User or PendingUser
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    const existingPending = await this.prisma.pendingUser.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser || existingPending) {
      throw new (require("@nestjs/common").BadRequestException)(
        "Email is already registered or pending confirmation."
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    // Create PendingUser
    await this.prisma.pendingUser.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name ?? createUserDto.email.split("@")[0],
        hashedPassword,
        confirmationToken,
      },
    });

    // Send confirmation email
    const apiUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const confirmUrl = `${apiUrl}/auth/confirm?token=${confirmationToken}`;

    // Configure nodemailer transporter (use environment variables for real credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "your_ethereal_user",
        pass: process.env.SMTP_PASS || "your_ethereal_pass",
      },
    });

    await transporter.sendMail({
      from: "noreply@yourapp.com",
      to: createUserDto.email,
      subject: "Confirm your account",
      html: `<p>Thank you for registering! Please confirm your account by clicking the link below:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
    });

    return {
      message:
        "Confirmation email sent! Please check your email to complete registration.",
    };
  }

  async confirmAccount(token: string) {
    if (!token) throw new Error("Missing confirmation token");
    console.log("[CONFIRM] Received token:", token);
    // Find PendingUser by token
    const pending = await this.prisma.pendingUser.findUnique({
      where: { confirmationToken: token },
    });
    console.log("[CONFIRM] PendingUser found:", pending);
    if (!pending) throw new Error("Invalid or expired token");

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: pending.email },
    });
    console.log("[CONFIRM] Existing user:", existingUser);
    if (existingUser) throw new Error("User already exists.");

    // Create User
    const createdUser = await this.prisma.user.create({
      data: {
        email: pending.email,
        password: pending.hashedPassword,
        role: "user",
        name: pending.name,
        isConfirmed: true,
        confirmationToken: null,
      },
    });
    console.log("[CONFIRM] Created user:", createdUser);

    // Delete PendingUser
    const deletedPending = await this.prisma.pendingUser.delete({
      where: { id: pending.id },
    });
    console.log("[CONFIRM] Deleted PendingUser:", deletedPending);

    return { message: "Account confirmed! You may now log in." };
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    console.log("Login attempt:", loginDto.email, loginDto.password);
    console.log("User from DB:", user);
    console.log(
      "Password match:",
      user ? await bcrypt.compare(loginDto.password, user.password) : false
    );

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (!user.isConfirmed) {
      throw new UnauthorizedException(
        "Please confirm your email before logging in."
      );
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role ?? "user",
      },
      token,
    };
  }
}
