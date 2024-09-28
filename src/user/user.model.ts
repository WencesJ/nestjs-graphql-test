import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class UserDoc {
  @Field(() => String)
  id: User['id'];

  @Field()
  email: User['email'];

  @HideField()
  password: User['password'];

  @Field({ nullable: true })
  biometricKey?: User['biometricKey'];

  @Field()
  createdAt: User['createdAt'];

  @Field()
  updatedAt: User['updatedAt'];
}
