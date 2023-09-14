import { Test, TestingModule } from '@nestjs/testing';
import { UserrefferalController } from './userrefferal.controller';

describe('UserrefferalController', () => {
  let controller: UserrefferalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserrefferalController],
    }).compile();

    controller = module.get<UserrefferalController>(UserrefferalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
