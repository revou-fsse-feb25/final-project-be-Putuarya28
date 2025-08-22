import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    console.log("Registration Successful:", createUserDto);
    return this.authService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Get("confirm")
  async confirm(@Query("token") token: string, @Res() res: Response) {
    try {
      await this.authService.confirmAccount(token);
      // Redirect to frontend login page after successful confirmation
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
      return res.redirect(`${frontendUrl}/login?confirmed=1`);
    } catch (err: any) {
      // Optionally, redirect to an error page or return a message
      return res.status(400).send(err?.message || "Confirmation failed");
    }
  }
}
