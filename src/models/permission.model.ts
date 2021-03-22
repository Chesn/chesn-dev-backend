import { ObjectType } from '@nestjs/graphql';

import { BaseModel } from './base.model';

@ObjectType()
export class Permission extends BaseModel {
  name!: string;
  description?: string;
}
