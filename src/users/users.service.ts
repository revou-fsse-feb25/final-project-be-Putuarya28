import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    // Exclude password from user responses
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new Error("Invalid or missing user id");
    }
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    // Exclude password from response
    const { password, ...rest } = user;
    return rest;
  }

  async create(createUserDto: any) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException("Missing required fields");
    }
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || "user",
      },
    });
    const { password, ...rest } = newUser;
    return rest;
  }

  async update(id: number, updateUserDto: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const { password, ...rest } = updated;
    return rest;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    const removed = await this.prisma.user.delete({ where: { id } });
    const { password, ...rest } = removed;
    return rest;
  }
}
