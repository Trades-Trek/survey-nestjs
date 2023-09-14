import { Test, TestingModule } from '@nestjs/testing';
import { AdminrefferalperController } from './adminrefferalper.controller';

describe('AdminrefferalperController', () => {
  let controller: AdminrefferalperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminrefferalperController],
    }).compile();

    controller = module.get<AdminrefferalperController>(AdminrefferalperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
