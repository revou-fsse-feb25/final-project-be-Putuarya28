import { Controller, Get, Post, Body } from "@nestjs/common";
import { AvailableDatesService } from "./available-dates.service";
import { CreateAvailableDateDto } from "./dto/create-available-date.dto";

@Controller("available-dates")
export class AvailableDatesController {
  constructor(private readonly availableDatesService: AvailableDatesService) {}

  @Post()
  async create(@Body() createAvailableDateDto: CreateAvailableDateDto) {
    return this.availableDatesService.create(createAvailableDateDto);
  }

  @Get()
  async findAll() {
    return this.availableDatesService.findAll();
  }
}
