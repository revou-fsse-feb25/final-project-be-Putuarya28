import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id") id: string) {
    const userId = Number(id);
    if (!userId || isNaN(userId)) {
      throw new Error("Invalid or missing user id");
    }
    return this.usersService.findOne(userId);
  }

  @Post()
  @Roles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  // Allow users to PATCH their own profile
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async patchSelf(@Param("id") id: string, @Body() updateUserDto: any) {
    // Optionally, check if the user is updating their own profile
    // (req.user.id === id) if you want to restrict
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(":id")
  @Roles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }
}
