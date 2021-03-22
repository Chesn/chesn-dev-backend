import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { Post } from './post.model';

@ObjectType()
export class Category extends BaseModel {
  name!: string;
  description?: string;

  @Field(() => [Post])
  posts!: Post[];
}
