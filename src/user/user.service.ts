import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserCreateInput } from './dtos/inputs/user-create.input';
import { UserDoc } from './user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getByEmail(email: string): Promise<UserDoc | null> {
    return this.userRepository.getByEmail(email);
  }

  async findOne(findArgs: Prisma.UserWhereInput): Promise<UserDoc | null> {
    return this.userRepository.findOne(findArgs);
  }

  async create(createUserInput: UserCreateInput): Promise<UserDoc> {
    const emailExists = await this.getByEmail(createUserInput.email);

    if (emailExists) throw new ConflictException('Email exists! Use another.');

    return this.userRepository.create({
      ...createUserInput,
    });
  }
}
