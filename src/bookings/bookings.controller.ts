import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Request } from "express";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user?.id;
    console.log("BookingController: Received booking request", {
      createBookingDto,
      userId,
    });
    if (!userId) throw new UnauthorizedException("User not authenticated");

    const result = await this.bookingsService.create({
      ...createBookingDto,
      customerId: userId,
    } as any);
    console.log("BookingController: Booking created result", result);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get("customer/:customerId")
  @UseGuards(JwtAuthGuard)
  async getCustomerBookings(
    @Param("customerId") customerId: string,
    @Req() req: Request
  ) {
    const user = (req as any).user;
    console.log(
      "[DEBUG] getCustomerBookings - User from JWT:",
      user,
      "customerId param:",
      customerId
    );
    return this.bookingsService.findByCustomer(Number(customerId));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() updateDto: any,
    @Req() req: Request
  ) {
    const user = (req as any).user;
    console.log("[DEBUG] User from JWT:", user);
    if (!user) throw new UnauthorizedException("User not authenticated");

    const booking = await this.bookingsService.findById(Number(id));
    if (!booking) throw new UnauthorizedException("Booking not found");
    if (user.role === "admin") {
      // Admin can update any booking
    } else if (booking.customerId !== user.id) {
      // Non-admin users can only update their own bookings
      throw new UnauthorizedException("Not authorized to update this booking");
    }
    return this.bookingsService.update(Number(id), updateDto);
  }

  @Delete(":id")
  @Roles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param("id") id: string) {
    return this.bookingsService.remove(Number(id));
  }
}
