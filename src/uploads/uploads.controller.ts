import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("uploads")
export class UploadsController {
  @Post("design-image")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    })
  )
  uploadDesignImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: "No file uploaded or invalid file type." };
    }
    
    return { url: `/uploads/${file.filename}` };
  }
}
