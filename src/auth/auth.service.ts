import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDoc } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { configEnv } from 'src/utils/config';
import { cryptHelper } from 'src/utils/helper';
import {
  UserBiometricsLoginInput,
  UserStandardLoginInput,
} from './dtos/inputs/login.input';
import { UserRegisterInput } from './dtos/inputs/register.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserDoc | null> {
    const user = await this.userService.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) return null;

    return user;
  }

  async loginUserWithStandardEmail(data: UserStandardLoginInput) {
    const user = await this.validateUserCredentials(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async loginUserWithBiometrics(data: UserBiometricsLoginInput) {
    //encrypt the biometricKey
    const encryptedBiometricKey = cryptHelper.aesEncrypt(
      data.biometricKey,
      configEnv.BIOMETRIC_SECRET,
    );

    const user = await this.userService.findOne({
      biometricKey: encryptedBiometricKey,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid biometric credentials');
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async registerUser(data: UserRegisterInput) {
    return await this.userService.create(data);
  }
}
