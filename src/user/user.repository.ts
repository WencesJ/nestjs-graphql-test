import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { configEnv } from 'src/utils/config';
import { PrismaService } from 'src/utils/database/prisma/prisma.service';
import { cryptHelper } from 'src/utils/helper';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    //Hash user password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //Encrypt biometricKey
    const encryptedBiometricKey = data.biometricKey
      ? cryptHelper.aesEncrypt(data.biometricKey, configEnv.BIOMETRIC_SECRET)
      : null;

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        biometricKey: encryptedBiometricKey,
      },
    });
  }

  async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
    return await this.prisma.user.findFirst({ where });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
