import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { configEnv, validateEnv } from 'src/utils/config';
import { PrismaModule } from 'src/utils/database/prisma/prisma.module';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { cryptHelper } from 'src/utils/helper';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let module: TestingModule;
  let userService: UserService;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ validate: validateEnv }),
        JwtModule.registerAsync({
          async useFactory() {
            return { secret: 'secret' };
          },
        }),
        UserModule,
        PrismaModule,
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get(AuthService);
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
      email: `email@example.com`,
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

  describe('validateUserCredentials', () => {
    it('should return user if valid credentials', async () => {
      const userData = getMockUserData();

      const user = await getMockedDBUserData(userData);

      jest.spyOn(bcrypt, 'compare').getMockImplementation();

      const result = await authService.validateUserCredentials(
        userData.email,
        userData.password,
      );

      expect(result).toEqual(user);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        user.password,
      );
    });

    it('should return null if incorrect email', async () => {
      const result = await authService.validateUserCredentials(
        'invalid@email.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });

    it('should return null if incorrect password', async () => {
      const userData = getMockUserData();

      const user = await getMockedDBUserData(userData);

      jest.spyOn(bcrypt, 'compare').getMockImplementation();

      const result = await authService.validateUserCredentials(
        userData.email,
        'incorrect-password',
      );

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'incorrect-password',
        user.password,
      );
    });
  });

  describe('loginUserWithStandardEmail', () => {
    it('should return token for valid credentials', async () => {
      const userData = getMockUserData();

      await getMockedDBUserData(userData);

      const result = await authService.loginUserWithStandardEmail({
        email: userData.email,
        password: userData.password,
      });

      expect(result.access_token).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      await expect(
        authService.loginUserWithStandardEmail({
          email: 'invalid@email.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginUserWithBiometrics', () => {
    it('should return token for valid biometric credentials', async () => {
      const userData = getMockUserData();

      const biometricKey = 'biometricKey';

      await getMockedDBUserData({ ...userData, biometricKey });

      jest.spyOn(cryptHelper, 'aesEncrypt').getMockImplementation();

      const result = await authService.loginUserWithBiometrics({
        biometricKey,
      });
      expect(cryptHelper.aesEncrypt).toHaveBeenCalledWith(
        biometricKey,
        configEnv.BIOMETRIC_SECRET,
      );
      expect(result.access_token).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid biometric credentials', async () => {
      const biometricKey = 'biometricKey';

      await expect(
        authService.loginUserWithBiometrics({ biometricKey }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerUser', () => {
    it('should create new user', async () => {
      const userData = getMockUserData();

      jest.spyOn(userService, 'create').getMockImplementation();

      const result = await authService.registerUser(userData);

      expect(result).toBeDefined();

      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining(userData),
      );
    });
  });
});
