import { Module } from '@nestjs/common';
import { DesignImagesController } from './design-images.controller';
import { DesignImagesService } from './design-images.service';

@Module({
  controllers: [DesignImagesController],
  providers: [DesignImagesService]
})
export class DesignImagesModule {}
