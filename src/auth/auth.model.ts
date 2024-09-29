import { Field, ObjectType } from '@nestjs/graphql';
import { UserDoc } from 'src/user/user.model';

@ObjectType()
export class LoggedInDoc {
  @Field(() => String)
  access_token: string;

  @Field(() => UserDoc)
  user: UserDoc;
}
