import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from './base.model';
import { Category } from './category.model';
import { User } from './user.model';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: 'Post status',
});

@ObjectType()
export class Post extends BaseModel {
  @Field()
  title!: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => User)
  author!: User;

  @Field(() => Category)
  category!: Category;
}
