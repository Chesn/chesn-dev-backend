import { InputType, Field } from '@nestjs/graphql';
import { PostStatus } from '../../../models';

@InputType()
export class ChangePostStatusInput {
  @Field()
  status!: PostStatus;
}
