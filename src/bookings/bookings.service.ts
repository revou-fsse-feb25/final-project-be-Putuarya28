import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  async findById(id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    console.log(
      "BookingsService: Creating booking with data",
      createBookingDto
    );
    try {
      const result = await this.prisma.booking.create({
        data: {
          name: createBookingDto.name,
          email: createBookingDto.email,
          whatsapp: createBookingDto.whatsapp,
          date: new Date(createBookingDto.date).toISOString(),
          time: createBookingDto.time,
          status: "pending",
          customer: { connect: { id: createBookingDto.customerId } },
          serviceType: createBookingDto.serviceType,
          measurementType: createBookingDto.measurementType,
          size: createBookingDto.size,
          bust: createBookingDto.bust,
          waist: createBookingDto.waist,
          hip: createBookingDto.hip,
          shoulder: createBookingDto.shoulder,
          sleeve: createBookingDto.sleeve,
          kebayaLength: createBookingDto.kebayaLength,
          notes: createBookingDto.notes,
        },
      });
      console.log("BookingsService: Booking created result", result);
      return result;
    } catch (error) {
      console.error("BookingsService: Error creating booking", error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findByCustomer(customerId: number) {
    return this.prisma.booking.findMany({
      where: { customerId: customerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, updateDto: any) {
    const prevBooking = await this.prisma.booking.findUnique({ where: { id } });

    let updateData = { ...updateDto };
    if (updateDto.postCallDetails) {
      updateData.postCallDetails = updateDto.postCallDetails;
    }
    if (updateDto.orderDetails) {
      updateData.orderDetails = updateDto.orderDetails;
      updateData.status = "processing order";
    }
    if (updateDto.trackingCode) {
      updateData.trackingCode = updateDto.trackingCode;
      updateData.status = "delivering";
    }
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // Send tracking code email if trackingCode was just added
    if (updateDto.trackingCode) {
      try {
        // TODO: Implement sendTrackingEmail utility
        // const { sendTrackingEmail } = await import("../utils/email");
        // await sendTrackingEmail(updatedBooking.email, updateDto.trackingCode);
        console.log(
          "[INFO] Tracking code sent to user:",
          updateDto.trackingCode
        );
      } catch (err) {
        console.error("Error sending tracking code email:", err);
      }
    }

    if (
      updateDto.status === "confirmed" &&
      prevBooking?.status !== "confirmed"
    ) {
      try {
        const { sendConfirmationEmail } = await import("../utils/email");
        await sendConfirmationEmail(updatedBooking.email, updatedBooking);
      } catch (err) {
        console.error("Error sending confirmation email:", err);
      }
    }

    if (
      prevBooking?.status === "confirmed" &&
      ((updateDto.date && updateDto.date !== prevBooking.date) ||
        (updateDto.time && updateDto.time !== prevBooking.time))
    ) {
      try {
        const { sendRescheduleEmail } = await import("../utils/email");
        await sendRescheduleEmail(
          updatedBooking.email,
          updatedBooking,
          prevBooking
        );
      } catch (err) {
        console.error("Error sending reschedule email:", err);
      }
    }

    if (updateDto.postCallDetails) {
      try {
        const { sendPostCallNotesEmail } = await import("../utils/email");
        await sendPostCallNotesEmail(
          updatedBooking.email,
          updatedBooking,
          updateDto.postCallDetails
        );
      } catch (err) {
        console.error("Error sending post video call details email:", err);
      }
    }

    // Send order details email if orderDetails is present
    if (updateDto.orderDetails) {
      try {
        const { sendOrderDetailsEmail } = await import("../utils/email");
        await sendOrderDetailsEmail(
          updatedBooking.email,
          updatedBooking,
          updateDto.orderDetails
        );
      } catch (err) {
        console.error("Error sending order details email:", err);
      }
    }

    return updatedBooking;
  }

  async remove(id: number) {
    return this.prisma.booking.delete({ where: { id } });
  }
}
