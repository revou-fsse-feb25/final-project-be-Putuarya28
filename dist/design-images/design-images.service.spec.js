"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const design_images_service_1 = require("./design-images.service");
describe('DesignImagesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [design_images_service_1.DesignImagesService],
        }).compile();
        service = module.get(design_images_service_1.DesignImagesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
