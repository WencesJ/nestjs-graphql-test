import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [PrismaService, UserRepository, UserService],
    }).compile();

    userService = module.get(UserService);
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

  const getMockUserData = () => {
    return {
      email: `email1@example.com`,
      password: 'StrongPassword123!',
    };
  };

  const getMockedDBUserData = async (data: {
    email: string;
    password: string;
    biometricKey?: string;
  }) => {
    return await userService.create(data);
  };

  describe('create', () => {
    it('create a user', async () => {
      const userData = getMockUserData();

      const result = await userService.create(userData);

      expect(result.email).toEqual(userData.email);
    });

    it('create a user with biometricKey', async () => {
      const userData = getMockUserData();

      const biometricKey = 'e21dae94kagkl';
      const result = await userService.create({ ...userData, biometricKey });

      expect(result.email).toEqual(userData.email);
      expect(result.biometricKey).toEqual(biometricKey);
    });

    it('throws error when email exists in db', async () => {
      const userData = getMockUserData();

      await getMockedDBUserData(userData);

      await expect(userService.create({ ...userData })).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const userData = getMockUserData();

      const user = await getMockedDBUserData(userData);

      const where = { id: user.id };

      const result = await userService.findOne(where);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const where = { id: 'non-existing-id' };

      const result = await userService.findOne(where);

      expect(result).toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('should find a user by email', async () => {
      const userData = getMockUserData();

      const user = await getMockedDBUserData(userData);

      const result = await userService.getByEmail(userData.email);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found by email', async () => {
      const email = 'nonexistent@example.com';

      const result = await userService.getByEmail(email);

      expect(result).toBeNull();
    });
  });
});
