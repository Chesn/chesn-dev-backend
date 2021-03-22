import { ObjectType, HideField } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { Role } from './role.model';
import { Post } from './post.model';

@ObjectType()
export class User extends BaseModel {
  email!: string;
  username?: string;
  role!: Role;
  posts!: Post[];

  @HideField()
  password!: string;
}
