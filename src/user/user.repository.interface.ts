import { User } from '@prisma/client';
import { IRepository } from 'src/interface/repository';

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): Promise<User | null>;
}
