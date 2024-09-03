import { Test, TestingModule } from '@nestjs/testing';
import { SensorsGateway } from './sensors.gateway';

describe('SensorsGateway', () => {
  let gateway: SensorsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorsGateway],
    }).compile();

    gateway = module.get<SensorsGateway>(SensorsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
