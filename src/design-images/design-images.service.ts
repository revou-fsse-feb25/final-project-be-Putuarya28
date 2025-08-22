import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class DesignImagesService {
  private prisma = new PrismaClient();

  async findAll(label: string) {
    return this.prisma.designImage.findMany({
      where: { label },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: any) {
    return this.prisma.designImage.create({ data });
  }

  async delete(id: number) {
    return this.prisma.designImage.delete({ where: { id } });
  }
}
