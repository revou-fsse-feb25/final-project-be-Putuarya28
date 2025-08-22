import { Test, TestingModule } from '@nestjs/testing';
import { DesignImagesService } from './design-images.service';

describe('DesignImagesService', () => {
  let service: DesignImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignImagesService],
    }).compile();

    service = module.get<DesignImagesService>(DesignImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
