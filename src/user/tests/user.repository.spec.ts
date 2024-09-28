import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { UserRepository } from '../user.repository';

// jest.mock('bcrypt');

describe('UserRepository', () => {
  let module: TestingModule;
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile();

    userRepository = module.get(UserRepository);
    prismaService = module.get(PrismaService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
    if (prismaService) {
      await prismaService.onModuleDestroy();
    }
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {},
    });
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('methods', () => {
    it('create should be defined', async () => {
      expect(userRepository.create).toBeDefined();
    });

    it('findOne should be defined', async () => {
      expect(userRepository.findOne).toBeDefined();
    });

    it('getByEmail should be defined', async () => {
      expect(userRepository.getByEmail).toBeDefined();
    });
  });

  describe('create', () => {
    it('hashes password before create', async () => {
      const userData = {
        email: `email1@example.com`,
        password: 'StrongPassword123!',
      };

      jest.spyOn(bcrypt, 'hash').getMockImplementation();

      prismaService.user.create = jest.fn().mockResolvedValue(null);

      await userRepository.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });
  });
});
