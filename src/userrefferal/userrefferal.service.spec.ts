import { Test, TestingModule } from '@nestjs/testing';
import { UserrefferalService } from './userrefferal.service';

describe('UserrefferalService', () => {
  let service: UserrefferalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserrefferalService],
    }).compile();

    service = module.get<UserrefferalService>(UserrefferalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
