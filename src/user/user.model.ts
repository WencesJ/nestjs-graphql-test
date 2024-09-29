import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class UserDoc {
  @Field(() => String)
  id: User['id'];

  @Field(() => String)
  email: User['email'];

  @HideField()
  password: User['password'];

  @Field(() => String, { nullable: true })
  biometricKey?: User['biometricKey'];

  @Field(() => Date)
  createdAt: User['createdAt'];

  @Field(() => Date)
  updatedAt: User['updatedAt'];
}
