import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { AvailableDatesModule } from "./available-dates/available-dates.module";
import { DesignImagesModule } from "./design-images/design-images.module";
import { UsersModule } from "./users/users.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    AuthModule,
    BookingsModule,
    AvailableDatesModule,
    DesignImagesModule,
    UsersModule,
    UploadsModule,
  ],
})
export class AppModule {}
