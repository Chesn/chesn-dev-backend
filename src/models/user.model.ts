import { ObjectType, HideField, Field } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { Role } from './role.model';
import { Post } from './post.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  email!: string;

  @Field({ nullable: true })
  username?: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => [Post])
  posts!: Post[];

  @HideField()
  password!: string;
}
