import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from './base.model';

@ObjectType()
export class Permission extends BaseModel {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}
