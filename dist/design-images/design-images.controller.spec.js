"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const design_images_controller_1 = require("./design-images.controller");
const design_images_service_1 = require("./design-images.service");
describe("DesignImagesController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [design_images_controller_1.DesignImagesController],
            providers: [design_images_service_1.DesignImagesService],
        }).compile();
        controller = module.get(design_images_controller_1.DesignImagesController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
