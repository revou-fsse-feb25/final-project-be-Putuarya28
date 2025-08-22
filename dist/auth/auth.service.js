"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        // Check if email already exists in User or PendingUser
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        const existingPending = await this.prisma.pendingUser.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser || existingPending) {
            throw new (require("@nestjs/common").BadRequestException)("Email is already registered or pending confirmation.");
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
        const transporter = nodemailer_1.default.createTransport({
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
            message: "Confirmation email sent! Please check your email to complete registration.",
        };
    }
    async confirmAccount(token) {
        if (!token)
            throw new Error("Missing confirmation token");
        console.log("[CONFIRM] Received token:", token);
        // Find PendingUser by token
        const pending = await this.prisma.pendingUser.findUnique({
            where: { confirmationToken: token },
        });
        console.log("[CONFIRM] PendingUser found:", pending);
        if (!pending)
            throw new Error("Invalid or expired token");
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: pending.email },
        });
        console.log("[CONFIRM] Existing user:", existingUser);
        if (existingUser)
            throw new Error("User already exists.");
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
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        console.log("Login attempt:", loginDto.email, loginDto.password);
        console.log("User from DB:", user);
        console.log("Password match:", user ? await bcrypt.compare(loginDto.password, user.password) : false);
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.isConfirmed) {
            throw new common_1.UnauthorizedException("Please confirm your email before logging in.");
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
