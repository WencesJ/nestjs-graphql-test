// src/resolvers/auth.resolver.ts

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserDoc } from 'src/user/user.model';
import { LoggedInDoc } from './auth.model';
import { AuthService } from './auth.service';
import {
  UserBiometricsLoginInput,
  UserStandardLoginInput,
} from './dtos/inputs/login.input';
import { UserRegisterInput } from './dtos/inputs/register.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserDoc)
  async userRegistration(
    @Args('userRegistration') input: UserRegisterInput,
  ): Promise<UserDoc> {
    return this.authService.registerUser(input);
  }

  @Mutation(() => LoggedInDoc)
  async userStandardLogin(
    @Args('userStandardLogin') input: UserStandardLoginInput,
  ): Promise<LoggedInDoc> {
    return this.authService.loginUserWithStandardEmail(input);
  }

  @Mutation(() => LoggedInDoc)
  async userBiometricsLogin(
    @Args('userBiometricsLogin') input: UserBiometricsLoginInput,
  ): Promise<LoggedInDoc> {
    return this.authService.loginUserWithBiometrics(input);
  }
}
