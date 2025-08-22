import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { DesignImagesService } from "./design-images.service";
import { Express } from "express";

@Controller("design-images")
export class DesignImagesController {
  constructor(private readonly service: DesignImagesService) {}

  @Get()
  async findAll(@Query("label") label: string) {
    return this.service.findAll(label);
  }

  @Post()
  @Roles("admin")
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor("file", { dest: "./uploads" }))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!file) throw new BadRequestException("No file uploaded");
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    await this.service.create({ ...body, imageUrl });
    return this.service.findAll(body.label);
  }

  @Delete(":id")
  @Roles("admin")
  @UseGuards(RolesGuard)
  async delete(@Param("id") id: string) {
    return this.service.delete(Number(id));
  }
}
