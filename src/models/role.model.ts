import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { User } from './user.model';
import { Permission } from './permission.model';

@ObjectType()
export class Role extends BaseModel {
  name!: string;

  @Field({ nullable: true })
  description?: string;

  users!: User[];
  permissions!: Permission[];
}
