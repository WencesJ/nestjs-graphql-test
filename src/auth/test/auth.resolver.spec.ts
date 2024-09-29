import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { validateEnv } from 'src/utils/config';
import { PrismaModule } from 'src/utils/database/prisma/prisma.module';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let module: TestingModule;
  let authResolver: AuthResolver;
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
      providers: [AuthService, AuthResolver],
    }).compile();

    authResolver = module.get(AuthResolver);
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

  describe('userRegistration', () => {
    it('should register a user', async () => {
      const input = {
        email: 'input@email.com',
        password: 'input.password',
      };
      const result = await authResolver.userRegistration(input);

      expect(result).toEqual(
        expect.objectContaining({
          email: input.email,
          biometricKey: null,
        }),
      );
    });
  });

  describe('userStandardLogin', () => {
    it('should login a user with standard email', async () => {
      const input = {
        email: 'input@email.com',
        password: 'input.password',
        biometricKey: 'input.biometricKey',
      };

      const registeredUser = await authResolver.userRegistration(input);

      const result = await authResolver.userStandardLogin(input);

      expect(result.access_token).toBeDefined();
      expect(result.user).toEqual(expect.objectContaining(registeredUser));
    });
  });

  describe('userBiometricsLogin', () => {
    it('should login a user with biometrics', async () => {
      const input = {
        email: 'input@email.com',
        password: 'input.password',
        biometricKey: 'input.biometricKey',
      };
      const registeredUser = await authResolver.userRegistration(input);

      const result = await authResolver.userBiometricsLogin({
        biometricKey: input.biometricKey,
      });

      expect(result.access_token).toBeDefined();
      expect(result.user).toEqual(expect.objectContaining(registeredUser));
    });
  });
});
