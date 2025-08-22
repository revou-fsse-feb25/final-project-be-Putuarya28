import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from "@nestjs/common";
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
  async confirm(@Query("token") token: string) {
    try {
      return await this.authService.confirmAccount(token);
    } catch (err: any) {
      throw new BadRequestException(err?.message || "Confirmation failed");
    }
  }
}
