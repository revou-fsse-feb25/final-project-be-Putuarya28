import { Test, TestingModule } from "@nestjs/testing";
import { DesignImagesController } from "./design-images.controller";
import { DesignImagesService } from "./design-images.service";

describe("DesignImagesController", () => {
  let controller: DesignImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignImagesController],
      providers: [DesignImagesService],
    }).compile();

    controller = module.get<DesignImagesController>(DesignImagesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

