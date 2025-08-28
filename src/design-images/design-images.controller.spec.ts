import { Test, TestingModule } from "@nestjs/testing";
import { DesignImagesController } from "./design-images.controller";
import { DesignImagesService } from "./design-images.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

describe("DesignImagesController", () => {
  let controller: DesignImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignImagesController],
      providers: [DesignImagesService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<DesignImagesController>(DesignImagesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
