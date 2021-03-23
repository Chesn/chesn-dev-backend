import { InputType, Field } from '@nestjs/graphql';

import { PostStatus } from '../../../models';

@InputType()
export class UpdatePostInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  status?: PostStatus;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}
