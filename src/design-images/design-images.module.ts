import { Module } from "@nestjs/common";
import { DesignImagesController } from "./design-images.controller";
import { DesignImagesService } from "./design-images.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [DesignImagesController],
  providers: [DesignImagesService],
})
export class DesignImagesModule {}
