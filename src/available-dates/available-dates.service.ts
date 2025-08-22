import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAvailableDateDto } from "./dto/create-available-date.dto";

@Injectable()
export class AvailableDatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvailableDateDto: CreateAvailableDateDto) {
    return this.prisma.availableDate.create({
      data: {
        date: createAvailableDateDto.date,
      },
    });
  }

  async findAll() {
    return this.prisma.availableDate.findMany();
  }
}
