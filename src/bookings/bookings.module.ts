import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_jwt_secret",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
