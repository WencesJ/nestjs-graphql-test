import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { configEnv, validateEnv } from 'src/utils/config';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { cryptHelper } from 'src/utils/helper';
import { UserRepository } from '../user.repository';
// jest.mock('bcrypt');

describe('UserRepository', () => {
  let module: TestingModule;
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ validate: validateEnv })],
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
        email: `user.email@example.com`,
        password: 'StrongPassword123!',
      };

      jest.spyOn(bcrypt, 'hash').getMockImplementation();

      const mockedUserCreate = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(null as any);

      await userRepository.create(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);

      mockedUserCreate.mockRestore();
    });

    it('encrypts biometricsKey before create', async () => {
      const userData = {
        email: `user.email@example.com`,
        password: 'StrongPassword123!',
        biometricKey: 'any-biometrics-key',
      };

      jest.spyOn(cryptHelper, 'aesEncrypt').getMockImplementation();

      const user = await userRepository.create(userData);

      expect(cryptHelper.aesEncrypt).toHaveBeenCalledWith(
        userData.biometricKey,
        configEnv.BIOMETRIC_SECRET,
      );
      expect(user.biometricKey).not.toBe(userData.biometricKey);
    });
  });
});
