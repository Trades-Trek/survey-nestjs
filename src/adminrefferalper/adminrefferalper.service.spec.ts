import { Test, TestingModule } from '@nestjs/testing';
import { AdminrefferalperService } from './adminrefferalper.service';

describe('AdminrefferalperService', () => {
  let service: AdminrefferalperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminrefferalperService],
    }).compile();

    service = module.get<AdminrefferalperService>(AdminrefferalperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
