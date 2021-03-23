import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { Post } from './post.model';

@ObjectType()
export class Category extends BaseModel {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Post])
  posts!: Post[];
}
