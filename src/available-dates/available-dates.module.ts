import { Module } from "@nestjs/common";
import { AvailableDatesController } from "./available-dates.controller";
import { AvailableDatesService } from "./available-dates.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [AvailableDatesController],
  providers: [AvailableDatesService, PrismaService],
})
export class AvailableDatesModule {}
